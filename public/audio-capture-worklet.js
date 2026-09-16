/**
 * AudioWorklet processor for real-time PCM16 audio capture.
 *
 * Runs in a dedicated audio thread — immune to main-thread jank that causes
 * audio glitches with the deprecated ScriptProcessorNode.
 *
 * Collects 128-sample frames from the browser's audio graph, resamples to
 * the target rate (16kHz) if needed, converts Float32 → Int16 PCM, and posts
 * the raw bytes to the main thread via MessagePort.
 */

class AudioCaptureProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    // processorOptions: { targetSampleRate: 16000 }
    const opts = options.processorOptions || {};
    this._targetRate = opts.targetSampleRate || 16000;
    this._stopped = false;

    // Accumulation buffer — AudioWorklet delivers exactly 128 samples per
    // process() call. We accumulate to ~20ms chunks (320 samples at 16kHz)
    // before posting to reduce MessagePort overhead.
    this._buffer = new Float32Array(0);
    this._chunkSize = Math.round(this._targetRate * 0.02); // 20ms

    this.port.onmessage = (e) => {
      if (e.data === 'stop') {
        this._stopped = true;
      }
    };
  }

  process(inputs) {
    if (this._stopped) return false;

    const input = inputs[0];
    if (!input || input.length === 0 || !input[0]) return true;

    const channelData = input[0]; // mono — Float32Array(128)
    const actualRate = sampleRate; // globalThis.sampleRate in worklet scope

    // Resample if browser's AudioContext rate differs from target
    let samples;
    if (actualRate !== this._targetRate) {
      samples = this._resample(channelData, actualRate, this._targetRate);
    } else {
      samples = channelData;
    }

    // Accumulate
    const newBuf = new Float32Array(this._buffer.length + samples.length);
    newBuf.set(this._buffer);
    newBuf.set(samples, this._buffer.length);
    this._buffer = newBuf;

    // Flush full chunks
    while (this._buffer.length >= this._chunkSize) {
      const chunk = this._buffer.slice(0, this._chunkSize);
      this._buffer = this._buffer.slice(this._chunkSize);

      // Convert Float32 → Int16 PCM
      const pcm16 = new Int16Array(chunk.length);
      for (let i = 0; i < chunk.length; i++) {
        const s = Math.max(-1, Math.min(1, chunk[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // Post the Int16Array buffer (transferable for zero-copy)
      this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    }

    return true;
  }

  _resample(input, fromRate, toRate) {
    const ratio = fromRate / toRate;
    const outputLength = Math.round(input.length / ratio);
    if (outputLength <= 0) return new Float32Array(0);
    const output = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const srcIdx = i * ratio;
      const low = Math.floor(srcIdx);
      const high = Math.min(low + 1, input.length - 1);
      const frac = srcIdx - low;
      output[i] = input[low] * (1 - frac) + input[high] * frac;
    }
    return output;
  }
}

registerProcessor('audio-capture-processor', AudioCaptureProcessor);
