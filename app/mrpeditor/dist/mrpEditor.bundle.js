/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 30:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var note = __webpack_require__(157)
var isMidi = function (n) { return n !== null && n !== [] && n >= 0 && n < 129 }
var toMidi = function (n) { return isMidi(n) ? +n : note.midi(n) }

// Adds note name to midi conversion
module.exports = function (player) {
  if (player.buffers) {
    var map = player.opts.map
    var toKey = typeof map === 'function' ? map : toMidi
    var mapper = function (name) {
      return name ? toKey(name) || name : null
    }

    player.buffers = mapBuffers(player.buffers, mapper)
    var start = player.start
    player.start = function (name, when, options) {
      var key = mapper(name)
      var dec = key % 1
      if (dec) {
        key = Math.floor(key)
        options = Object.assign(options || {}, { cents: Math.floor(dec * 100) })
      }
      return start(key, when, options)
    }
  }
  return player
}

function mapBuffers (buffers, toKey) {
  return Object.keys(buffers).reduce(function (mapped, name) {
    mapped[toKey(name)] = buffers[name]
    return mapped
  }, {})
}


/***/ }),

/***/ 65:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var load = __webpack_require__(795)
var player = __webpack_require__(387)

/**
 * Load a soundfont instrument. It returns a promise that resolves to a
 * instrument object.
 *
 * The instrument object returned by the promise has the following properties:
 *
 * - name: the instrument name
 * - play: A function to play notes from the buffer with the signature
 * `play(note, time, duration, options)`
 *
 *
 * The valid options are:
 *
 * - `format`: the soundfont format. 'mp3' by default. Can be 'ogg'
 * - `soundfont`: the soundfont name. 'MusyngKite' by default. Can be 'FluidR3_GM'
 * - `nameToUrl` <Function>: a function to convert from instrument names to URL
 * - `destination`: by default Soundfont uses the `audioContext.destination` but you can override it.
 * - `gain`: the gain of the player (1 by default)
 * - `notes`: an array of the notes to decode. It can be an array of strings
 * with note names or an array of numbers with midi note numbers. This is a
 * performance option: since decoding mp3 is a cpu intensive process, you can limit
 * limit the number of notes you want and reduce the time to load the instrument.
 *
 * @param {AudioContext} ac - the audio context
 * @param {String} name - the instrument name. For example: 'acoustic_grand_piano'
 * @param {Object} options - (Optional) the same options as Soundfont.loadBuffers
 * @return {Promise}
 *
 * @example
 * var Soundfont = require('sounfont-player')
 * Soundfont.instrument('marimba').then(function (marimba) {
 *   marimba.play('C4')
 * })
 */
function instrument (ac, name, options) {
  if (arguments.length === 1) return function (n, o) { return instrument(ac, n, o) }
  var opts = options || {}
  var isUrl = opts.isSoundfontURL || isSoundfontURL
  var toUrl = opts.nameToUrl || nameToUrl
  var url = isUrl(name) ? name : toUrl(name, opts.soundfont, opts.format)

  return load(ac, url, { only: opts.only || opts.notes }).then(function (buffers) {
    var p = player(ac, buffers, opts).connect(opts.destination ? opts.destination : ac.destination)
    p.url = url
    p.name = name
    return p
  })
}

function isSoundfontURL (name) {
  return /\.js(\?.*)?$/i.test(name)
}

/**
 * Given an instrument name returns a URL to to the Benjamin Gleitzman's
 * package of [pre-rendered sound fonts](https://github.com/gleitz/midi-js-soundfonts)
 *
 * @param {String} name - instrument name
 * @param {String} soundfont - (Optional) the soundfont name. One of 'FluidR3_GM'
 * or 'MusyngKite' ('MusyngKite' by default)
 * @param {String} format - (Optional) Can be 'mp3' or 'ogg' (mp3 by default)
 * @returns {String} the Soundfont file url
 * @example
 * var Soundfont = require('soundfont-player')
 * Soundfont.nameToUrl('marimba', 'mp3')
 */
function nameToUrl (name, sf, format) {
  format = format === 'ogg' ? format : 'mp3'
  sf = sf === 'FluidR3_GM' ? sf : 'MusyngKite'
  return 'https://gleitz.github.io/midi-js-soundfonts/' + sf + '/' + name + '-' + format + '.js'
}

// In the 1.0.0 release it will be:
// var Soundfont = {}
var Soundfont = __webpack_require__(418)
Soundfont.instrument = instrument
Soundfont.nameToUrl = nameToUrl

if ( true && module.exports) module.exports = Soundfont
if (typeof window !== 'undefined') window.Soundfont = Soundfont


/***/ }),

/***/ 83:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";



const zlib_inflate = __webpack_require__(447);
const utils        = __webpack_require__(805);
const strings      = __webpack_require__(996);
const msg          = __webpack_require__(674);
const ZStream      = __webpack_require__(442);
const GZheader     = __webpack_require__(414);

const toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_FINISH,
  Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR
} = __webpack_require__(681);

/* ===========================================================================*/


/**
 * class Inflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[inflate]]
 * and [[inflateRaw]].
 **/

/* internal
 * inflate.chunks -> Array
 *
 * Chunks of output data, if [[Inflate#onData]] not overridden.
 **/

/**
 * Inflate.result -> Uint8Array|String
 *
 * Uncompressed result, generated by default [[Inflate#onData]]
 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Inflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Inflate.err -> Number
 *
 * Error code after inflate finished. 0 (Z_OK) on success.
 * Should be checked if broken data possible.
 **/

/**
 * Inflate.msg -> String
 *
 * Error message, if [[Inflate.err]] != 0
 **/


/**
 * new Inflate(options)
 * - options (Object): zlib inflate options.
 *
 * Creates new inflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `windowBits`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw inflate
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 * By default, when no options set, autodetect deflate/gzip data format via
 * wrapper header.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 * const chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const inflate = new pako.Inflate({ level: 3});
 *
 * inflate.push(chunk1, false);
 * inflate.push(chunk2, true);  // true -> last chunk
 *
 * if (inflate.err) { throw new Error(inflate.err); }
 *
 * console.log(inflate.result);
 * ```
 **/
function Inflate(options) {
  this.options = utils.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ''
  }, options || {});

  const opt = this.options;

  // Force window size for `raw` data, if not set directly,
  // because we have no header for autodetect.
  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
    opt.windowBits = -opt.windowBits;
    if (opt.windowBits === 0) { opt.windowBits = -15; }
  }

  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
      !(options && options.windowBits)) {
    opt.windowBits += 32;
  }

  // Gzip header has no info about windows size, we can do autodetect only
  // for deflate. So, if window size not set, force it to max when gzip possible
  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
    // bit 3 (16) -> gzipped data
    // bit 4 (32) -> autodetect gzip/deflate
    if ((opt.windowBits & 15) === 0) {
      opt.windowBits |= 15;
    }
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm   = new ZStream();
  this.strm.avail_out = 0;

  let status  = zlib_inflate.inflateInit2(
    this.strm,
    opt.windowBits
  );

  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }

  this.header = new GZheader();

  zlib_inflate.inflateGetHeader(this.strm, this.header);

  // Setup dictionary
  if (opt.dictionary) {
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      opt.dictionary = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      opt.dictionary = new Uint8Array(opt.dictionary);
    }
    if (opt.raw) { //In raw mode we need to set the dictionary early
      status = zlib_inflate.inflateSetDictionary(this.strm, opt.dictionary);
      if (status !== Z_OK) {
        throw new Error(msg[status]);
      }
    }
  }
}

/**
 * Inflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer): input data
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE
 *   flush modes. See constants. Skipped or `false` means Z_NO_FLUSH,
 *   `true` means Z_FINISH.
 *
 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
 * new output chunks. Returns `true` on success. If end of stream detected,
 * [[Inflate#onEnd]] will be called.
 *
 * `flush_mode` is not needed for normal operation, because end of stream
 * detected automatically. You may try to use it for advanced things, but
 * this functionality was not tested.
 *
 * On fail call [[Inflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Inflate.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  const dictionary = this.options.dictionary;
  let status, _flush_mode, last_avail_out;

  if (this.ended) return false;

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    status = zlib_inflate.inflate(strm, _flush_mode);

    if (status === Z_NEED_DICT && dictionary) {
      status = zlib_inflate.inflateSetDictionary(strm, dictionary);

      if (status === Z_OK) {
        status = zlib_inflate.inflate(strm, _flush_mode);
      } else if (status === Z_DATA_ERROR) {
        // Replace code with more verbose
        status = Z_NEED_DICT;
      }
    }

    // Skip snyc markers if more data follows and not raw mode
    while (strm.avail_in > 0 &&
           status === Z_STREAM_END &&
           strm.state.wrap > 0 &&
           data[strm.next_in] !== 0)
    {
      zlib_inflate.inflateReset(strm);
      status = zlib_inflate.inflate(strm, _flush_mode);
    }

    switch (status) {
      case Z_STREAM_ERROR:
      case Z_DATA_ERROR:
      case Z_NEED_DICT:
      case Z_MEM_ERROR:
        this.onEnd(status);
        this.ended = true;
        return false;
    }

    // Remember real `avail_out` value, because we may patch out buffer content
    // to align utf8 strings boundaries.
    last_avail_out = strm.avail_out;

    if (strm.next_out) {
      if (strm.avail_out === 0 || status === Z_STREAM_END) {

        if (this.options.to === 'string') {

          let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);

          let tail = strm.next_out - next_out_utf8;
          let utf8str = strings.buf2string(strm.output, next_out_utf8);

          // move tail & realign counters
          strm.next_out = tail;
          strm.avail_out = chunkSize - tail;
          if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);

          this.onData(utf8str);

        } else {
          this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
        }
      }
    }

    // Must repeat iteration if out buffer is full
    if (status === Z_OK && last_avail_out === 0) continue;

    // Finalize if end of stream reached.
    if (status === Z_STREAM_END) {
      status = zlib_inflate.inflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return true;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Inflate#onData(chunk) -> Void
 * - chunk (Uint8Array|String): output data. When string output requested,
 *   each chunk will be string.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Inflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Inflate#onEnd(status) -> Void
 * - status (Number): inflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called either after you tell inflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Inflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    if (this.options.to === 'string') {
      this.result = this.chunks.join('');
    } else {
      this.result = utils.flattenChunks(this.chunks);
    }
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * inflate(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Decompress `data` with inflate/ungzip and `options`. Autodetect
 * format via wrapper header by default. That's why we don't provide
 * separate `ungzip` method.
 *
 * Supported options are:
 *
 * - windowBits
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 * - `to` (String) - if equal to 'string', then result will be converted
 *   from utf8 to utf16 (javascript) string. When string output requested,
 *   chunk length can differ from `chunkSize`, depending on content.
 *
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako');
 * const input = pako.deflate(new Uint8Array([1,2,3,4,5,6,7,8,9]));
 * let output;
 *
 * try {
 *   output = pako.inflate(input);
 * } catch (err) {
 *   console.log(err);
 * }
 * ```
 **/
function inflate(input, options) {
  const inflator = new Inflate(options);

  inflator.push(input);

  // That will never happens, if you don't cheat with options :)
  if (inflator.err) throw inflator.msg || msg[inflator.err];

  return inflator.result;
}


/**
 * inflateRaw(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * The same as [[inflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function inflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return inflate(input, options);
}


/**
 * ungzip(data[, options]) -> Uint8Array|String
 * - data (Uint8Array|ArrayBuffer): input data to decompress.
 * - options (Object): zlib inflate options.
 *
 * Just shortcut to [[inflate]], because it autodetects format
 * by header.content. Done for convenience.
 **/


module.exports.Inflate = Inflate;
module.exports.inflate = inflate;
module.exports.inflateRaw = inflateRaw;
module.exports.ungzip = inflate;
module.exports.constants = __webpack_require__(681);


/***/ }),

/***/ 137:
/***/ ((module) => {

module.exports = ADSR

function ADSR(audioContext){
  var node = audioContext.createGain()

  var voltage = node._voltage = getVoltage(audioContext)
  var value = scale(voltage)
  var startValue = scale(voltage)
  var endValue = scale(voltage)

  node._startAmount = scale(startValue)
  node._endAmount = scale(endValue)

  node._multiplier = scale(value)
  node._multiplier.connect(node)
  node._startAmount.connect(node)
  node._endAmount.connect(node)

  node.value = value.gain
  node.startValue = startValue.gain
  node.endValue = endValue.gain

  node.startValue.value = 0
  node.endValue.value = 0

  Object.defineProperties(node, props)
  return node
}

var props = {

  attack: { value: 0, writable: true },
  decay: { value: 0, writable: true },
  sustain: { value: 1, writable: true },
  release: {value: 0, writable: true },

  getReleaseDuration: {
    value: function(){
      return this.release
    }
  },

  start: {
    value: function(at){
      var target = this._multiplier.gain
      var startAmount = this._startAmount.gain
      var endAmount = this._endAmount.gain

      this._voltage.start(at)
      this._decayFrom = this._decayFrom = at+this.attack
      this._startedAt = at

      var sustain = this.sustain

      target.cancelScheduledValues(at)
      startAmount.cancelScheduledValues(at)
      endAmount.cancelScheduledValues(at)

      endAmount.setValueAtTime(0, at)

      if (this.attack){
        target.setValueAtTime(0, at)
        target.linearRampToValueAtTime(1, at + this.attack)

        startAmount.setValueAtTime(1, at)
        startAmount.linearRampToValueAtTime(0, at + this.attack)
      } else {
        target.setValueAtTime(1, at)
        startAmount.setValueAtTime(0, at)
      }

      if (this.decay){
        target.setTargetAtTime(sustain, this._decayFrom, getTimeConstant(this.decay))
      }
    }
  },

  stop: {
    value: function(at, isTarget){
      if (isTarget){
        at = at - this.release
      }

      var endTime = at + this.release
      if (this.release){

        var target = this._multiplier.gain
        var startAmount = this._startAmount.gain
        var endAmount = this._endAmount.gain

        target.cancelScheduledValues(at)
        startAmount.cancelScheduledValues(at)
        endAmount.cancelScheduledValues(at)

        var expFalloff = getTimeConstant(this.release)

        // truncate attack (required as linearRamp is removed by cancelScheduledValues)
        if (this.attack && at < this._decayFrom){
          var valueAtTime = getValue(0, 1, this._startedAt, this._decayFrom, at)
          target.linearRampToValueAtTime(valueAtTime, at)
          startAmount.linearRampToValueAtTime(1-valueAtTime, at)
          startAmount.setTargetAtTime(0, at, expFalloff)
        }

        endAmount.setTargetAtTime(1, at, expFalloff)
        target.setTargetAtTime(0, at, expFalloff)
      }

      this._voltage.stop(endTime)
      return endTime
    }
  },

  onended: {
    get: function(){
      return this._voltage.onended
    },
    set: function(value){
      this._voltage.onended = value
    }
  }

}

var flat = new Float32Array([1,1])
function getVoltage(context){
  var voltage = context.createBufferSource()
  var buffer = context.createBuffer(1, 2, context.sampleRate)
  buffer.getChannelData(0).set(flat)
  voltage.buffer = buffer
  voltage.loop = true
  return voltage
}

function scale(node){
  var gain = node.context.createGain()
  node.connect(gain)
  return gain
}

function getTimeConstant(time){
  return Math.log(time+1)/Math.log(100)
}

function getValue(start, end, fromTime, toTime, at){
  var difference = end - start
  var time = toTime - fromTime
  var truncateTime = at - fromTime
  var phase = truncateTime / time
  var value = start + phase * difference

  if (value <= start) {
      value = start
  }
  if (value >= end) {
      value = end
  }

  return value
}


/***/ }),

/***/ 157:
/***/ ((module) => {

"use strict";


var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/
/**
 * A regex for matching note strings in scientific notation.
 *
 * @name regex
 * @function
 * @return {RegExp} the regexp used to parse the note name
 *
 * The note string should have the form `letter[accidentals][octave][element]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * The executed regex contains (by array index):
 *
 * - 0: the complete string
 * - 1: the note letter
 * - 2: the optional accidentals
 * - 3: the optional octave
 * - 4: the rest of the string (trimmed)
 *
 * @example
 * var parser = require('note-parser')
 * parser.regex.exec('c#4')
 * // => ['c#4', 'c', '#', '4', '']
 * parser.regex.exec('c#4 major')
 * // => ['c#4major', 'c', '#', '4', 'major']
 * parser.regex().exec('CMaj7')
 * // => ['CMaj7', 'C', '', '', 'Maj7']
 */
function regex () { return REGEX }

var SEMITONES = [0, 2, 4, 5, 7, 9, 11]
/**
 * Parse a note name in scientific notation an return it's components,
 * and some numeric properties including midi number and frequency.
 *
 * @name parse
 * @function
 * @param {String} note - the note string to be parsed
 * @param {Boolean} isTonic - true if the note is the tonic of something.
 * If true, en extra tonicOf property is returned. It's false by default.
 * @param {Float} tunning - The frequency of A4 note to calculate frequencies.
 * By default it 440.
 * @return {Object} the parsed note name or null if not a valid note
 *
 * The parsed note name object will ALWAYS contains:
 * - letter: the uppercase letter of the note
 * - acc: the accidentals of the note (only sharps or flats)
 * - pc: the pitch class (letter + acc)
 * - step: s a numeric representation of the letter. It's an integer from 0 to 6
 * where 0 = C, 1 = D ... 6 = B
 * - alt: a numeric representation of the accidentals. 0 means no alteration,
 * positive numbers are for sharps and negative for flats
 * - chroma: a numeric representation of the pitch class. It's like midi for
 * pitch classes. 0 = C, 1 = C#, 2 = D ... It can have negative values: -1 = Cb.
 * Can detect pitch class enhramonics.
 *
 * If the note has octave, the parser object will contain:
 * - oct: the octave number (as integer)
 * - midi: the midi number
 * - freq: the frequency (using tuning parameter as base)
 *
 * If the parameter `isTonic` is set to true, the parsed object will contain:
 * - tonicOf: the rest of the string that follows note name (left and right trimmed)
 *
 * @example
 * var parse = require('note-parser').parse
 * parse('Cb4')
 * // => { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: -1,
 *         oct: 4, midi: 59, freq: 246.94165062806206 }
 * // if no octave, no midi, no freq
 * parse('fx')
 * // => { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
 */
function parse (str, isTonic, tuning) {
  if (typeof str !== 'string') return null
  var m = REGEX.exec(str)
  if (!m || !isTonic && m[4]) return null

  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') }
  p.pc = p.letter + p.acc
  p.step = (p.letter.charCodeAt(0) + 3) % 7
  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length
  p.chroma = SEMITONES[p.step] + p.alt
  if (m[3]) {
    p.oct = +m[3]
    p.midi = p.chroma + 12 * (p.oct + 1)
    p.freq = midiToFreq(p.midi, tuning)
  }
  if (isTonic) p.tonicOf = m[4]
  return p
}

/**
 * Given a midi number, return its frequency
 * @param {Integer} midi - midi note number
 * @param {Float} tuning - (Optional) the A4 tuning (440Hz by default)
 * @return {Float} frequency in hertzs
 */
function midiToFreq (midi, tuning) {
  return Math.pow(2, (midi - 69) / 12) * (tuning || 440)
}

var parser = { parse: parse, regex: regex, midiToFreq: midiToFreq }
var FNS = ['letter', 'acc', 'pc', 'step', 'alt', 'chroma', 'oct', 'midi', 'freq']
FNS.forEach(function (name) {
  parser[name] = function (src) {
    var p = parse(src)
    return p && (typeof p[name] !== 'undefined') ? p[name] : null
  }
})

module.exports = parser

// extra API docs
/**
 * Get midi of a note
 *
 * @name midi
 * @function
 * @param {String} note - the note name
 * @return {Integer} the midi number of the note or null if not a valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.midi('A4') // => 69
 * parser.midi('A') // => null
 */
/**
 * Get freq of a note in hertzs (in a well tempered 440Hz A4)
 *
 * @name freq
 * @function
 * @param {String} note - the note name
 * @return {Float} the freq of the number if hertzs or null if not valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.freq('A4') // => 440
 * parser.freq('A') // => null
 */


/***/ }),

/***/ 161:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encodeBase64 = encodeBase64;
exports.decodeBase64 = decodeBase64;
/**
 * 将二进制数据编码为Base64字符串
 * @param data 二进制数据（Uint8Array）
 * @returns Base64编码的字符串
 */
function encodeBase64(data) {
    if (!data)
        throw new Error("Input data cannot be null");
    // 在浏览器环境中使用btoa，在Node.js中使用Buffer
    //   if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    // 浏览器环境
    var binary = '';
    var len = data.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(data[i]);
    }
    return window.btoa(binary);
    //   } else {
    //     // Node.js环境
    //     return Buffer.from(data).toString('base64');
    //   }
}
/**
 * 将Base64字符串解码为二进制数据
 * @param base64Str Base64编码的字符串
 * @returns 解码后的二进制数据（Uint8Array）
 */
function decodeBase64(base64Str) {
    if (!base64Str)
        throw new Error("Input string cannot be null");
    // 在浏览器环境中使用atob，在Node.js中使用Buffer
    //   if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    // 浏览器环境
    var binaryStr = window.atob(base64Str);
    var len = binaryStr.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes;
    //   } else {
    //     // Node.js环境
    //     return new Uint8Array(Buffer.from(base64Str, 'base64'));
    //   }
}


/***/ }),

/***/ 174:
/***/ ((module) => {

"use strict";


var isArr = Array.isArray
var isObj = function (o) { return o && typeof o === 'object' }
var OPTS = {}

module.exports = function (player) {
  /**
   * Schedule a list of events to be played at specific time.
   *
   * It supports three formats of events for the events list:
   *
   * - An array with [time, note]
   * - An array with [time, object]
   * - An object with { time: ?, [name|note|midi|key]: ? }
   *
   * @param {Float} time - an absolute time to start (or AudioContext's
   * currentTime if provided number is 0)
   * @param {Array} events - the events list.
   * @return {Array} an array of ids
   *
   * @example
   * // Event format: [time, note]
   * var piano = player(ac, ...).connect(ac.destination)
   * piano.schedule(0, [ [0, 'C2'], [0.5, 'C3'], [1, 'C4'] ])
   *
   * @example
   * // Event format: an object { time: ?, name: ? }
   * var drums = player(ac, ...).connect(ac.destination)
   * drums.schedule(0, [
   *   { name: 'kick', time: 0 },
   *   { name: 'snare', time: 0.5 },
   *   { name: 'kick', time: 1 },
   *   { name: 'snare', time: 1.5 }
   * ])
   */
  player.schedule = function (time, events) {
    var now = player.context.currentTime
    var when = time < now ? now : time
    player.emit('schedule', when, events)
    var t, o, note, opts
    return events.map(function (event) {
      if (!event) return null
      else if (isArr(event)) {
        t = event[0]; o = event[1]
      } else {
        t = event.time; o = event
      }

      if (isObj(o)) {
        note = o.name || o.key || o.note || o.midi || null
        opts = o
      } else {
        note = o
        opts = OPTS
      }

      return player.start(note, when + (t || 0), opts)
    })
  }
  return player
}


/***/ }),

/***/ 202:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var midimessage = __webpack_require__(214)

module.exports = function (player) {
  /**
  * Connect a player to a midi input
  *
  * The options accepts:
  *
  * - channel: the channel to listen to. Listen to all channels by default.
  *
  * @param {MIDIInput} input
  * @param {Object} options - (Optional)
  * @return {SamplePlayer} the player
  * @example
  * var piano = player(...)
  * window.navigator.requestMIDIAccess().then(function (midiAccess) {
  *   midiAccess.inputs.forEach(function (midiInput) {
  *     piano.listenToMidi(midiInput)
  *   })
  * })
  */
  player.listenToMidi = function (input, options) {
    var started = {}
    var opts = options || {}
    var gain = opts.gain || function (vel) { return vel / 127 }

    input.onmidimessage = function (msg) {
      var mm = msg.messageType ? msg : midimessage(msg)
      if (mm.messageType === 'noteon' && mm.velocity === 0) {
        mm.messageType = 'noteoff'
      }
      if (opts.channel && mm.channel !== opts.channel) return

      switch (mm.messageType) {
        case 'noteon':
          started[mm.key] = player.play(mm.key, 0, { gain: gain(mm.velocity) })
          break
        case 'noteoff':
          if (started[mm.key]) {
            started[mm.key].stop()
            delete started[mm.key]
          }
          break
      }
    }
    return player
  }
  return player
}


/***/ }),

/***/ 214:
/***/ ((module) => {

(function(e){if(true){module.exports=e()}else // removed by dead control flow
{ var t; }})(function(){var e,t,s;return function o(e,t,s){function a(n,i){if(!t[n]){if(!e[n]){var l=undefined;if(!i&&l)return require(n,!0);if(r)return r(n,!0);var h=new Error("Cannot find module '"+n+"'");throw h.code="MODULE_NOT_FOUND",h}var c=t[n]={exports:{}};e[n][0].call(c.exports,function(t){var s=e[n][1][t];return a(s?s:t)},c,c.exports,o,e,t,s)}return t[n].exports}var r=undefined;for(var n=0;n<s.length;n++)a(s[n]);return a}({1:[function(e,t,s){"use strict";Object.defineProperty(s,"__esModule",{value:true});s["default"]=function(e){function t(e){this._event=e;this._data=e.data;this.receivedTime=e.receivedTime;if(this._data&&this._data.length<2){console.warn("Illegal MIDI message of length",this._data.length);return}this._messageCode=e.data[0]&240;this.channel=e.data[0]&15;switch(this._messageCode){case 128:this.messageType="noteoff";this.key=e.data[1]&127;this.velocity=e.data[2]&127;break;case 144:this.messageType="noteon";this.key=e.data[1]&127;this.velocity=e.data[2]&127;break;case 160:this.messageType="keypressure";this.key=e.data[1]&127;this.pressure=e.data[2]&127;break;case 176:this.messageType="controlchange";this.controllerNumber=e.data[1]&127;this.controllerValue=e.data[2]&127;if(this.controllerNumber===120&&this.controllerValue===0){this.channelModeMessage="allsoundoff"}else if(this.controllerNumber===121){this.channelModeMessage="resetallcontrollers"}else if(this.controllerNumber===122){if(this.controllerValue===0){this.channelModeMessage="localcontroloff"}else{this.channelModeMessage="localcontrolon"}}else if(this.controllerNumber===123&&this.controllerValue===0){this.channelModeMessage="allnotesoff"}else if(this.controllerNumber===124&&this.controllerValue===0){this.channelModeMessage="omnimodeoff"}else if(this.controllerNumber===125&&this.controllerValue===0){this.channelModeMessage="omnimodeon"}else if(this.controllerNumber===126){this.channelModeMessage="monomodeon"}else if(this.controllerNumber===127){this.channelModeMessage="polymodeon"}break;case 192:this.messageType="programchange";this.program=e.data[1];break;case 208:this.messageType="channelpressure";this.pressure=e.data[1]&127;break;case 224:this.messageType="pitchbendchange";var t=e.data[2]&127;var s=e.data[1]&127;this.pitchBend=(t<<8)+s;break}}return new t(e)};t.exports=s["default"]},{}]},{},[1])(1)});
//# sourceMappingURL=dist/index.js.map

/***/ }),

/***/ 269:
/***/ ((module) => {

"use strict";


// Note: adler32 takes 12% for level 0 and 2% for level 6.
// It isn't worth it to make additional optimizations as in original.
// Small size is preferable.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32 = (adler, buf, len, pos) => {
  let s1 = (adler & 0xffff) |0,
      s2 = ((adler >>> 16) & 0xffff) |0,
      n = 0;

  while (len !== 0) {
    // Set limit ~ twice less than 5552, to keep
    // s2 in 31-bits, because we force signed ints.
    // in other case %= will fail.
    n = len > 2000 ? 2000 : len;
    len -= n;

    do {
      s1 = (s1 + buf[pos++]) |0;
      s2 = (s2 + s1) |0;
    } while (--n);

    s1 %= 65521;
    s2 %= 65521;
  }

  return (s1 | (s2 << 16)) |0;
};


module.exports = adler32;


/***/ }),

/***/ 289:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

// 需要安装的依赖:
// npm install pako @types/pako gbk.js
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MrpInfo = void 0;
var pako = __importStar(__webpack_require__(668));
var GBK = __importStar(__webpack_require__(298));
// 辅助工具类
var ListUtil = /** @class */ (function () {
    function ListUtil() {
    }
    ListUtil.insertIntoUint8Array = function (target, offset, data) {
        var newArray = new Uint8Array(target.length + data.length);
        newArray.set(target.subarray(0, offset), 0);
        newArray.set(data, offset);
        newArray.set(target.subarray(offset), offset + data.length);
        return newArray;
    };
    ListUtil.removeRange = function (target, start, length) {
        var newArray = new Uint8Array(target.length - length);
        newArray.set(target.subarray(0, start), 0);
        newArray.set(target.subarray(start + length), start);
        return newArray;
    };
    ListUtil.deleteFromUint8Array = function (target, start, length) {
        return this.removeRange(target, start, length);
    };
    return ListUtil;
}());
// MRP 文件项类
var FileItem = /** @class */ (function () {
    function FileItem(filename, filenameLen, fileOffset, fileLen, fileData) {
        this.filename = filename;
        this.filenameLen = filenameLen;
        this.fileOffset = fileOffset;
        this.fileLen = fileLen;
        this.fileData = fileData;
    }
    FileItem.prototype.toString = function () {
        return "\u6587\u4EF6: ".concat(this.filename, " (\u504F\u79FB: ").concat(this.fileOffset, ", \u957F\u5EA6: ").concat(this.fileLen, ")");
    };
    return FileItem;
}());
// MRP 文件信息类
var MrpInfo = /** @class */ (function () {
    function MrpInfo(data) {
        // 文件基本信息
        this.path = "";
        this.magic = "MRPG";
        // 文件结构信息
        this.fileStart = 0;
        this.mrpTotalLen = 0;
        this.mrpHeaderSize = 0;
        // 应用信息
        this.fileName = "";
        this.displayName = "";
        this.authStr = "";
        this.appid = 0;
        this.version = 0;
        this.flag = 3;
        this.builderVersion = 10002;
        this.crc32 = 0;
        this.vendor = "";
        this.desc = "";
        // 其他信息
        this.appidBE = 0;
        this.versionBE = 0;
        this.reserve2 = 0;
        this.screenWidth = 0;
        this.screenHeight = 0;
        this.plat = 1;
        this.reserve3 = new Array(31).fill(0);
        // 文件列表
        this.files = [];
        this.data = data;
        this._parseHeader();
        this._parseFileList();
    }
    // 工厂方法
    MrpInfo.fromBytes = function (data) {
        return new MrpInfo(data);
    };
    // 插入新文件到 MRP 中
    MrpInfo.prototype.insert = function (filename, fileData) {
        var fileItem = this.files.find(function (file) { return file.filename === filename; });
        // 检查文件名是否已存在
        if (fileItem) {
            fileItem.fileData = fileData;
            fileItem.fileLen = fileData.length;
            console.log("insert 更新文件数据：" + filename);
        }
        else {
            var filenameBytes = GBK.encode(filename);
            var filenameBytesWithNull = new Uint8Array(filenameBytes.length + 1);
            filenameBytesWithNull.set(filenameBytes);
            filenameBytesWithNull[filenameBytes.length] = 0;
            var filenameLen = filenameBytesWithNull.length;
            fileItem = new FileItem(filename, filenameLen, 0, fileData.length, fileData);
            this.files.push(fileItem);
        }
        this.pack();
        this._parseHeader();
        this._parseFileList();
    };
    MrpInfo.prototype.pack = function () {
        // this.crc32 = 0; // 初始为0，最后计算
        // this.reserve2 = 0;
        // this.reserve3 = new Array(31).fill(0);
        // 处理文件列表
        var listLen = 0;
        var dataLen = 0;
        var fileItems = [];
        // 计算文件列表和数据的长度
        for (var _i = 0, _a = this.files; _i < _a.length; _i++) {
            var file = _a[_i];
            var fileData = this.getFileData(file.filename);
            var filename = file.filename;
            // 处理文件名中的特殊格式 (name=xxx)
            if (file.filename.includes('(') && file.filename.includes(')')) {
                var tempStr = file.filename;
                var kString = tempStr.substring(tempStr.indexOf('(') + 1, tempStr.indexOf(')'));
                var items = kString.split(",");
                for (var _b = 0, items_1 = items; _b < items_1.length; _b++) {
                    var item = items_1[_b];
                    var _c = item.split("=").map(function (s) { return s.trim(); }), key = _c[0], value = _c[1];
                    if (key === "name") {
                        filename = value;
                    }
                }
            }
            // 处理 BMP565 转换
            // if (config.useBMP565 && file.path.toLowerCase().endsWith(".bmp")) {
            //     const bmp565Data = this._convertToBMP565(fileData);
            //     if (bmp565Data) {
            //         fileData = bmp565Data;
            //     }
            // }
            // 处理 GZIP 压缩
            // if (config.useGZIP) {
            //     fileData = this._gzipData(fileData);
            // }
            var filenameBytes = GBK.encode(filename);
            var filenameLen = filenameBytes.length + 1; // 包含 null 终止符
            // 每个列表项由文件名长度(4) + 文件名 + null(1) + 文件偏移(4) + 文件长度(4) + 保留(4) 组成
            listLen += 4 + filenameLen + 4 + 4 + 4;
            // 每个文件数据由文件名长度(4) + 文件名 + null(1) + 文件长度(4) + 文件数据 组成
            dataLen += 4 + filenameLen + 4 + fileData.length;
            fileItems.push({
                filename: filename,
                filenameLen: filenameLen,
                fileOffset: 0, // 稍后计算
                fileLen: fileData.length,
                data: fileData,
                item: file // 保留原始 FileItem 引用
            });
        }
        // 计算文件位置
        this.mrpHeaderSize = 240; // 固定头大小
        var firstFilePos = this.mrpHeaderSize + listLen;
        this.fileStart = firstFilePos - 8; // 需要减8，与Java代码一致
        this.mrpTotalLen = this.mrpHeaderSize + listLen + dataLen;
        // 创建数据缓冲区
        var buffer = new ArrayBuffer(this.mrpTotalLen);
        var dataView = new DataView(buffer);
        var uint8Array = new Uint8Array(buffer);
        var pos = 0;
        // 写入文件头
        this._writeString(uint8Array, pos, this.magic, 4);
        pos += 4;
        dataView.setInt32(pos, this.fileStart, true);
        pos += 4;
        dataView.setInt32(pos, this.mrpTotalLen, true);
        pos += 4;
        dataView.setInt32(pos, this.mrpHeaderSize, true);
        pos += 4;
        this._writeGBKString(uint8Array, pos, this.fileName, 12);
        pos += 12;
        this._writeGBKString(uint8Array, pos, this.displayName, 24);
        pos += 24;
        this._writeGBKString(uint8Array, pos, this.authStr, 16);
        pos += 16;
        dataView.setInt32(pos, this.appid, true);
        pos += 4;
        dataView.setInt32(pos, this.version, true);
        pos += 4;
        dataView.setInt32(pos, this.flag, true);
        pos += 4;
        dataView.setInt32(pos, this.builderVersion, true);
        pos += 4;
        dataView.setInt32(pos, this.crc32, true);
        pos += 4;
        this._writeGBKString(uint8Array, pos, this.vendor, 40);
        pos += 40;
        this._writeGBKString(uint8Array, pos, this.desc, 64);
        pos += 64;
        dataView.setInt32(pos, this.appidBE, false);
        pos += 4; // 大端
        dataView.setInt32(pos, this.versionBE, false);
        pos += 4; // 大端
        dataView.setInt32(pos, this.reserve2, true);
        pos += 4;
        dataView.setInt16(pos, this.screenWidth, true);
        pos += 2;
        dataView.setInt16(pos, this.screenHeight, true);
        pos += 2;
        uint8Array[pos++] = this.plat;
        pos += 31; // reserve3
        // 写入文件列表
        var filePos = firstFilePos;
        /*
        for (FileItem item : config.list_file) {
            try {
                // 每个文件数据由：文件名长度、文件名、文件大小组成，数值都是uint32因此需要4*2
                filePos += item.namesize + 1 + 4 * 2;
                item.offset = filePos;
                // 下一个文件数据的开始位置
                filePos += item.len;

                output.write(getIntByte(item.namesize + 1));
                output.write(item.filename.getBytes("GBK"));
                output.writeByte(0);
                output.write(getIntByte(item.offset));
                output.write(getIntByte(item.len));
                output.write(getIntByte(0));
                System.out.println("filename:" + item.filename + "    pos=" + filePos + " len=" + item.len);

            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        */
        for (var _d = 0, fileItems_1 = fileItems; _d < fileItems_1.length; _d++) {
            var item = fileItems_1[_d];
            filePos += item.filenameLen + 4 * 2;
            item.fileOffset = filePos;
            // 下一个文件数据的开始位置
            filePos += item.fileLen;
            // 写入文件名长度 (包含null)
            dataView.setInt32(pos, item.filenameLen, true);
            pos += 4;
            // 写入文件名 (GBK编码)
            var filenameBytes = GBK.encode(item.filename);
            uint8Array.set(filenameBytes, pos);
            pos += filenameBytes.length;
            uint8Array[pos++] = 0; // null终止符
            // 写入文件偏移
            dataView.setInt32(pos, item.fileOffset, true);
            pos += 4;
            // 写入文件长度
            dataView.setInt32(pos, item.fileLen, true);
            pos += 4;
            // 写入保留字段
            dataView.setInt32(pos, 0, true);
            pos += 4;
            item.item.fileOffset = filePos;
        }
        // 写入文件数据
        for (var _e = 0, fileItems_2 = fileItems; _e < fileItems_2.length; _e++) {
            var item = fileItems_2[_e];
            // 写入文件名长度 (包含null)
            dataView.setInt32(pos, item.filenameLen, true);
            pos += 4;
            // 写入文件名 (GBK编码)
            var filenameBytes = GBK.encode(item.filename);
            uint8Array.set(filenameBytes, pos);
            pos += filenameBytes.length;
            uint8Array[pos++] = 0; // null终止符
            // 写入文件长度
            dataView.setInt32(pos, item.fileLen, true);
            pos += 4;
            // 写入文件数据
            uint8Array.set(item.data, pos);
            pos += item.data.length;
        }
        // 计算并更新CRC32
        this.crc32 = this._calculateCRC32(uint8Array);
        dataView.setInt32(84, this.crc32, true);
        // 更新data
        this.data = uint8Array;
    };
    // 辅助方法：写入固定长度的字符串
    MrpInfo.prototype._writeString = function (array, offset, str, length) {
        var encoder = new TextEncoder();
        var encoded = encoder.encode(str);
        var len = Math.min(encoded.length, length);
        array.set(encoded.subarray(0, len), offset);
        // 剩余部分填充0
        if (len < length) {
            array.fill(0, offset + len, offset + length);
        }
    };
    // 辅助方法：写入固定长度的GBK字符串
    MrpInfo.prototype._writeGBKString = function (array, offset, str, length) {
        var encoded = new Uint8Array(GBK.encode(str)); // 强制转换为 Uint8Array
        var len = Math.min(encoded.length, length);
        array.set(encoded.subarray(0, len), offset);
        if (len < length) {
            array.fill(0, offset + len, offset + length);
        }
    };
    // 辅助方法：32位整数字节序交换
    MrpInfo.prototype._swapEndian32 = function (value) {
        return (((value & 0xFF) << 24) |
            ((value & 0xFF00) << 8) |
            ((value >> 8) & 0xFF00) |
            ((value >> 24) & 0xFF));
    };
    // 辅助方法：计算CRC32
    MrpInfo.prototype._calculateCRC32 = function (data) {
        var crc = 0xFFFFFFFF;
        for (var i = 0; i < data.length; i++) {
            if (i >= 84 && i < 88)
                continue; // 跳过CRC32字段本身
            crc ^= data[i];
            for (var j = 0; j < 8; j++) {
                crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
            }
        }
        return crc ^ 0xFFFFFFFF;
    };
    // 辅助方法：GZIP压缩数据
    MrpInfo.prototype._gzipData = function (data) {
        if (this._isGzip(data)) {
            return data;
        }
        return pako.gzip(data);
    };
    // 辅助方法：转换BMP到BMP565格式
    MrpInfo.prototype._convertToBMP565 = function (bmpData) {
        // 检查BMP文件头
        if (bmpData.length < 54 || bmpData[0] !== 0x42 || bmpData[1] !== 0x4D) {
            return null;
        }
        var view = new DataView(bmpData.buffer);
        var width = view.getInt32(18, true);
        var height = view.getInt32(22, true);
        var bitsPerPixel = view.getInt16(28, true);
        var dataOffset = view.getInt32(10, true);
        // 已经是16位色，直接返回
        if (bitsPerPixel === 16) {
            var bitmap = new Uint8Array(width * height * 2);
            for (var y = 0; y < height; y++) {
                var srcPos = dataOffset + (height - 1 - y) * width * 2;
                var destPos = y * width * 2;
                bitmap.set(bmpData.subarray(srcPos, srcPos + width * 2), destPos);
            }
            return bitmap;
        }
        // 24位色转16位色
        if (bitsPerPixel === 24) {
            var rowSize = Math.floor((width * 3 + 3) / 4) * 4; // 行对齐
            var bitmap = new Uint8Array(width * height * 2);
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var srcPos = dataOffset + (height - 1 - y) * rowSize + x * 3;
                    var r = bmpData[srcPos + 2] >> 3;
                    var g = bmpData[srcPos + 1] >> 2;
                    var b = bmpData[srcPos] >> 3;
                    var color = (r << 11) | (g << 5) | b;
                    var destPos = (y * width + x) * 2;
                    bitmap[destPos] = color & 0xFF;
                    bitmap[destPos + 1] = (color >> 8) & 0xFF;
                }
            }
            return bitmap;
        }
        return null;
    };
    // 从 MRP 中删除文件
    MrpInfo.prototype.remove = function (filename) {
        var fileIndex = this.files.findIndex(function (file) { return file.filename === filename; });
        if (fileIndex === -1) {
            throw new Error("\u6587\u4EF6\u4E0D\u5B58\u5728: ".concat(filename));
        }
        // 更新文件列表
        this.files.splice(fileIndex, 1);
        this.pack();
        this._parseHeader();
        this._parseFileList();
    };
    // 替换指定文件数据
    MrpInfo.prototype.replace = function (filename, newData) {
        this.remove(filename);
        this.insert(filename, newData);
    };
    // 解析 MRP 文件头
    MrpInfo.prototype._parseHeader = function () {
        this.fileStart = this._readInt(4);
        this.mrpTotalLen = this._readInt(8);
        this.mrpHeaderSize = this._readInt(12);
        this.fileName = this._readGBKString(16);
        this.displayName = this._readGBKString(28);
        this.authStr = this._readGBKString(52);
        this.appid = this._readInt(68);
        this.version = this._readInt(72);
        this.flag = this._readInt(76);
        this.builderVersion = this._readInt(80);
        this.crc32 = this._readInt(84);
        this.vendor = this._readGBKString(88);
        this.desc = this._readGBKString(128);
        this.appidBE = this._readBigInt(192);
        this.versionBE = this._readBigInt(196);
        this.reserve2 = this._readInt(200);
        this.screenWidth = this._readInt(204);
        this.screenHeight = this._readInt(206);
        this.plat = this.data[208];
    };
    // 写入 MRP 文件头
    MrpInfo.prototype.writeHeader = function () {
        this._setInt(4, this.fileStart);
        this._setInt(8, this.mrpTotalLen);
        this._setInt(12, this.mrpHeaderSize);
        this._setGBKString(16, this.fileName, 12);
        this._setGBKString(28, this.displayName, 24);
        this._setGBKString(52, this.authStr, 16);
        this._setInt(68, this.appid);
        this._setInt(72, this.version);
        this._setInt(76, this.flag);
        this._setInt(80, this.builderVersion);
        this._setInt(84, this.crc32);
        this._setGBKString(88, this.vendor, 40);
        this._setGBKString(128, this.desc, 64);
        this._setBigInt(192, this.appidBE);
        this._setBigInt(196, this.versionBE);
        this._setInt(200, this.reserve2);
        this._setInt(204, this.screenWidth);
        this._setInt(206, this.screenHeight);
        this.data[208] = this.plat;
    };
    // 解析文件列表
    MrpInfo.prototype._parseFileList = function () {
        this.files = [];
        var listStart = this.mrpHeaderSize;
        var listEnd = this.fileStart + 8;
        var offset = listStart;
        while (offset < listEnd) {
            var fileNameLen = this._readInt(offset);
            offset += 4;
            var filename = this._readGBKString(offset);
            offset += fileNameLen;
            console.log("read .... ".concat(filename, " ").concat(offset));
            var fileOffset = this._readInt(offset);
            offset += 4;
            var fileLen = this._readInt(offset);
            offset += 4;
            offset += 4; // 跳过保留字段
            if (filename) {
                this.files.push(new FileItem(filename, fileNameLen, fileOffset, fileLen, null));
            }
            console.log("offset=".concat(offset, " fileStart=").concat(this.fileStart));
        }
    };
    // 解包 MRP 文件到内存中的文件映射
    MrpInfo.prototype.unpackToMemory = function () {
        var result = new Map();
        for (var _i = 0, _a = this.files; _i < _a.length; _i++) {
            var file = _a[_i];
            var fileData = this.getFileData(file.filename);
            if (!fileData)
                continue;
            if (this._isGzip(fileData)) {
                try {
                    var decompressed = pako.ungzip(fileData);
                    result.set(file.filename, decompressed);
                }
                catch (e) {
                    console.log("\u89E3\u538B GZIP \u5931\u8D25: ".concat(file.filename, " - ").concat(e));
                }
            }
            else {
                result.set(file.filename, fileData);
            }
        }
        return result;
    };
    // 获取指定文件的数据
    MrpInfo.prototype.getFileData = function (filename) {
        var file = this.files.find(function (f) { return f.filename === filename; });
        if (!file) {
            throw new Error("\u6587\u4EF6\u4E0D\u5B58\u5728: ".concat(filename));
        }
        if (file.fileData) {
            console.log("getFileData 命中缓存 " + filename);
            return file.fileData;
        }
        try {
            return this.data.subarray(file.fileOffset, file.fileOffset + file.fileLen);
        }
        catch (e) {
            console.log("\u8BFB\u53D6\u6587\u4EF6\u6570\u636E\u5931\u8D25: ".concat(filename, " - ").concat(e));
            return null;
        }
    };
    // 辅助方法：读取小端序整数
    MrpInfo.prototype._readInt = function (offset) {
        return this.data[offset] |
            (this.data[offset + 1] << 8) |
            (this.data[offset + 2] << 16) |
            (this.data[offset + 3] << 24);
    };
    MrpInfo.prototype._setInt = function (offset, value) {
        this.data[offset] = value & 0xFF;
        this.data[offset + 1] = (value >> 8) & 0xFF;
        this.data[offset + 2] = (value >> 16) & 0xFF;
        this.data[offset + 3] = (value >> 24) & 0xFF;
    };
    // 辅助方法：读取大端序整数
    MrpInfo.prototype._readBigInt = function (offset) {
        return this.data[offset + 3] |
            (this.data[offset + 2] << 8) |
            (this.data[offset + 1] << 16) |
            (this.data[offset] << 24);
    };
    MrpInfo.prototype._setBigInt = function (offset, value) {
        this.data[offset] = (value >> 24) & 0xFF;
        this.data[offset + 1] = (value >> 16) & 0xFF;
        this.data[offset + 2] = (value >> 8) & 0xFF;
        this.data[offset + 3] = value & 0xFF;
    };
    // 辅助方法：读取 GBK 字符串
    MrpInfo.prototype._readGBKString = function (offset) {
        var len = 0;
        for (var i = offset; i < this.data.length; i++) {
            if (this.data[i] !== 0) {
                len++;
            }
            else {
                break;
            }
        }
        try {
            return GBK.decode(this.data.subarray(offset, offset + len));
        }
        catch (e) {
            console.log("\u89E3\u7801\u5B57\u7B26\u4E32\u5931\u8D25: ".concat(e, " ").concat(this.data.subarray(offset, offset + len)));
            return null;
        }
    };
    // 辅助方法：设置 GBK 字符串
    MrpInfo.prototype._setGBKString = function (offset, value, maxLen) {
        var bytes = GBK.encode(value);
        if (bytes.length > maxLen) {
            throw new Error("GBK \u5B57\u7B26\u4E32\u957F\u5EA6\u8D85\u8FC7\u9650\u5236: ".concat(value));
        }
        this.data.set(bytes, offset);
        // 填充剩余部分为 0
        for (var i = offset + bytes.length; i < offset + maxLen; i++) {
            this.data[i] = 0;
        }
    };
    // 辅助方法：检查是否为 GZIP 文件
    MrpInfo.prototype._isGzip = function (data) {
        return data.length >= 3 &&
            data[0] === 0x1f &&
            data[1] === 0x8b &&
            data[2] === 0x08;
    };
    MrpInfo.prototype.toString = function () {
        return "\nMRP \u6587\u4EF6\u4FE1\u606F:\n  \u6587\u4EF6\u540D: ".concat(this.fileName, "\n  \u663E\u793A\u540D: ").concat(this.displayName, "\n  \u4F9B\u5E94\u5546: ").concat(this.vendor, "\n  \u63CF\u8FF0: ").concat(this.desc, "\n  AppID: ").concat(this.appid, " (BE: ").concat(this.appidBE, ")\n  \u7248\u672C: ").concat(this.version, " (BE: ").concat(this.versionBE, ")\n  \u6784\u5EFA\u7248\u672C: ").concat(this.builderVersion, "\n  \u5C4F\u5E55\u5C3A\u5BF8: ").concat(this.screenWidth, "x").concat(this.screenHeight, "\n  \u5E73\u53F0: ").concat(this.plat, "\n  \u6587\u4EF6\u6570: ").concat(this.files.length, "\n  \u6570\u636E\u5927\u5C0F: ").concat(this.data.length, " \u5B57\u8282\n");
    };
    return MrpInfo;
}());
exports.MrpInfo = MrpInfo;
// 使用示例
function mrpinfoMain() {
    return __awaiter(this, void 0, void 0, function () {
        var fileData, i, mrpInfo, _i, _a, file, newFileData, memoryFiles, _b, _c, entry;
        return __generator(this, function (_d) {
            try {
                fileData = new Uint8Array(1024);
                for (i = 0; i < fileData.length; i++) {
                    fileData[i] = Math.floor(Math.random() * 256);
                }
                mrpInfo = MrpInfo.fromBytes(fileData);
                // 打印 MRP 信息
                console.log(mrpInfo.toString());
                // 打印文件列表
                for (_i = 0, _a = mrpInfo.files; _i < _a.length; _i++) {
                    file = _a[_i];
                    console.log(file.toString());
                }
                newFileData = GBK.encode('Hello, MRP!');
                mrpInfo.insert('new_file.txt', newFileData);
                mrpInfo.remove('new_file.txt');
                console.log("\u63D2\u5165\u6587\u4EF6\u540E\u6570\u636E\u5927\u5C0F: ".concat(mrpInfo.data.length, " \u5B57\u8282"));
                memoryFiles = mrpInfo.unpackToMemory();
                console.log("\u89E3\u5305\u5230\u5185\u5B58\u4E2D\u7684\u6587\u4EF6\u6570: ".concat(memoryFiles.size));
                // 打印文件列表
                for (_b = 0, _c = mrpInfo.files; _b < _c.length; _b++) {
                    entry = _c[_b];
                    console.log(entry.toString());
                }
            }
            catch (e) {
                console.log("\u5904\u7406 MRP \u6587\u4EF6\u51FA\u9519: ".concat(e));
                console.error(e);
            }
            return [2 /*return*/];
        });
    });
}
// 执行示例
// mrpinfoMain();


/***/ }),

/***/ 293:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// See state defs from inflate.js
const BAD = 16209;       /* got a data error -- remain here until reset */
const TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */

/*
   Decode literal, length, and distance codes and write out the resulting
   literal and match bytes until either not enough input or output is
   available, an end-of-block is encountered, or a data error is encountered.
   When large enough input and output buffers are supplied to inflate(), for
   example, a 16K input buffer and a 64K output buffer, more than 95% of the
   inflate execution time is spent in this routine.

   Entry assumptions:

        state.mode === LEN
        strm.avail_in >= 6
        strm.avail_out >= 258
        start >= strm.avail_out
        state.bits < 8

   On return, state.mode is one of:

        LEN -- ran out of enough output space or enough available input
        TYPE -- reached end of block code, inflate() to interpret next block
        BAD -- error in block data

   Notes:

    - The maximum input bits used by a length/distance pair is 15 bits for the
      length code, 5 bits for the length extra, 15 bits for the distance code,
      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
      Therefore if strm.avail_in >= 6, then there is enough input to avoid
      checking for available input while decoding.

    - The maximum bytes that a single length/distance pair can output is 258
      bytes, which is the maximum length that can be coded.  inflate_fast()
      requires strm.avail_out >= 258 for each loop to avoid checking for
      output space.
 */
module.exports = function inflate_fast(strm, start) {
  let _in;                    /* local strm.input */
  let last;                   /* have enough input while in < last */
  let _out;                   /* local strm.output */
  let beg;                    /* inflate()'s initial strm.output */
  let end;                    /* while out < end, enough space available */
//#ifdef INFLATE_STRICT
  let dmax;                   /* maximum distance from zlib header */
//#endif
  let wsize;                  /* window size or zero if not using window */
  let whave;                  /* valid bytes in the window */
  let wnext;                  /* window write index */
  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
  let s_window;               /* allocated sliding window, if wsize != 0 */
  let hold;                   /* local strm.hold */
  let bits;                   /* local strm.bits */
  let lcode;                  /* local strm.lencode */
  let dcode;                  /* local strm.distcode */
  let lmask;                  /* mask for first level of length codes */
  let dmask;                  /* mask for first level of distance codes */
  let here;                   /* retrieved table entry */
  let op;                     /* code bits, operation, extra bits, or */
                              /*  window position, window bytes to copy */
  let len;                    /* match length, unused bytes */
  let dist;                   /* match distance */
  let from;                   /* where to copy match from */
  let from_source;


  let input, output; // JS specific, because we have no pointers

  /* copy state to local variables */
  const state = strm.state;
  //here = state.here;
  _in = strm.next_in;
  input = strm.input;
  last = _in + (strm.avail_in - 5);
  _out = strm.next_out;
  output = strm.output;
  beg = _out - (start - strm.avail_out);
  end = _out + (strm.avail_out - 257);
//#ifdef INFLATE_STRICT
  dmax = state.dmax;
//#endif
  wsize = state.wsize;
  whave = state.whave;
  wnext = state.wnext;
  s_window = state.window;
  hold = state.hold;
  bits = state.bits;
  lcode = state.lencode;
  dcode = state.distcode;
  lmask = (1 << state.lenbits) - 1;
  dmask = (1 << state.distbits) - 1;


  /* decode literals and length/distances until end-of-block or not enough
     input data or output space */

  top:
  do {
    if (bits < 15) {
      hold += input[_in++] << bits;
      bits += 8;
      hold += input[_in++] << bits;
      bits += 8;
    }

    here = lcode[hold & lmask];

    dolen:
    for (;;) { // Goto emulation
      op = here >>> 24/*here.bits*/;
      hold >>>= op;
      bits -= op;
      op = (here >>> 16) & 0xff/*here.op*/;
      if (op === 0) {                          /* literal */
        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
        //        "inflate:         literal '%c'\n" :
        //        "inflate:         literal 0x%02x\n", here.val));
        output[_out++] = here & 0xffff/*here.val*/;
      }
      else if (op & 16) {                     /* length base */
        len = here & 0xffff/*here.val*/;
        op &= 15;                           /* number of extra bits */
        if (op) {
          if (bits < op) {
            hold += input[_in++] << bits;
            bits += 8;
          }
          len += hold & ((1 << op) - 1);
          hold >>>= op;
          bits -= op;
        }
        //Tracevv((stderr, "inflate:         length %u\n", len));
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = dcode[hold & dmask];

        dodist:
        for (;;) { // goto emulation
          op = here >>> 24/*here.bits*/;
          hold >>>= op;
          bits -= op;
          op = (here >>> 16) & 0xff/*here.op*/;

          if (op & 16) {                      /* distance base */
            dist = here & 0xffff/*here.val*/;
            op &= 15;                       /* number of extra bits */
            if (bits < op) {
              hold += input[_in++] << bits;
              bits += 8;
              if (bits < op) {
                hold += input[_in++] << bits;
                bits += 8;
              }
            }
            dist += hold & ((1 << op) - 1);
//#ifdef INFLATE_STRICT
            if (dist > dmax) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break top;
            }
//#endif
            hold >>>= op;
            bits -= op;
            //Tracevv((stderr, "inflate:         distance %u\n", dist));
            op = _out - beg;                /* max distance in output */
            if (dist > op) {                /* see if copy from window */
              op = dist - op;               /* distance back in window */
              if (op > whave) {
                if (state.sane) {
                  strm.msg = 'invalid distance too far back';
                  state.mode = BAD;
                  break top;
                }

// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//                if (len <= op - whave) {
//                  do {
//                    output[_out++] = 0;
//                  } while (--len);
//                  continue top;
//                }
//                len -= op - whave;
//                do {
//                  output[_out++] = 0;
//                } while (--op > whave);
//                if (op === 0) {
//                  from = _out - dist;
//                  do {
//                    output[_out++] = output[from++];
//                  } while (--len);
//                  continue top;
//                }
//#endif
              }
              from = 0; // window index
              from_source = s_window;
              if (wnext === 0) {           /* very common case */
                from += wsize - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              else if (wnext < op) {      /* wrap around window */
                from += wsize + wnext - op;
                op -= wnext;
                if (op < len) {         /* some from end of window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = 0;
                  if (wnext < len) {  /* some from start of window */
                    op = wnext;
                    len -= op;
                    do {
                      output[_out++] = s_window[from++];
                    } while (--op);
                    from = _out - dist;      /* rest from output */
                    from_source = output;
                  }
                }
              }
              else {                      /* contiguous in window */
                from += wnext - op;
                if (op < len) {         /* some from window */
                  len -= op;
                  do {
                    output[_out++] = s_window[from++];
                  } while (--op);
                  from = _out - dist;  /* rest from output */
                  from_source = output;
                }
              }
              while (len > 2) {
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                output[_out++] = from_source[from++];
                len -= 3;
              }
              if (len) {
                output[_out++] = from_source[from++];
                if (len > 1) {
                  output[_out++] = from_source[from++];
                }
              }
            }
            else {
              from = _out - dist;          /* copy direct from output */
              do {                        /* minimum length is three */
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                output[_out++] = output[from++];
                len -= 3;
              } while (len > 2);
              if (len) {
                output[_out++] = output[from++];
                if (len > 1) {
                  output[_out++] = output[from++];
                }
              }
            }
          }
          else if ((op & 64) === 0) {          /* 2nd level distance code */
            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
            continue dodist;
          }
          else {
            strm.msg = 'invalid distance code';
            state.mode = BAD;
            break top;
          }

          break; // need to emulate goto via "continue"
        }
      }
      else if ((op & 64) === 0) {              /* 2nd level length code */
        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
        continue dolen;
      }
      else if (op & 32) {                     /* end-of-block */
        //Tracevv((stderr, "inflate:         end of block\n"));
        state.mode = TYPE;
        break top;
      }
      else {
        strm.msg = 'invalid literal/length code';
        state.mode = BAD;
        break top;
      }

      break; // need to emulate goto via "continue"
    }
  } while (_in < last && _out < end);

  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
  len = bits >> 3;
  _in -= len;
  bits -= len << 3;
  hold &= (1 << bits) - 1;

  /* update state and return */
  strm.next_in = _in;
  strm.next_out = _out;
  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
  state.hold = hold;
  state.bits = bits;
  return;
};


/***/ }),

/***/ 298:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var gbk_us = __webpack_require__(346)
module.exports = __webpack_require__(667)(gbk_us);

/***/ }),

/***/ 303:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";



const zlib_deflate = __webpack_require__(411);
const utils        = __webpack_require__(805);
const strings      = __webpack_require__(996);
const msg          = __webpack_require__(674);
const ZStream      = __webpack_require__(442);

const toString = Object.prototype.toString;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH,
  Z_OK, Z_STREAM_END,
  Z_DEFAULT_COMPRESSION,
  Z_DEFAULT_STRATEGY,
  Z_DEFLATED
} = __webpack_require__(681);

/* ===========================================================================*/


/**
 * class Deflate
 *
 * Generic JS-style wrapper for zlib calls. If you don't need
 * streaming behaviour - use more simple functions: [[deflate]],
 * [[deflateRaw]] and [[gzip]].
 **/

/* internal
 * Deflate.chunks -> Array
 *
 * Chunks of output data, if [[Deflate#onData]] not overridden.
 **/

/**
 * Deflate.result -> Uint8Array
 *
 * Compressed result, generated by default [[Deflate#onData]]
 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
 * (call [[Deflate#push]] with `Z_FINISH` / `true` param).
 **/

/**
 * Deflate.err -> Number
 *
 * Error code after deflate finished. 0 (Z_OK) on success.
 * You will not need it in real life, because deflate errors
 * are possible only on wrong options or bad `onData` / `onEnd`
 * custom handlers.
 **/

/**
 * Deflate.msg -> String
 *
 * Error message, if [[Deflate.err]] != 0
 **/


/**
 * new Deflate(options)
 * - options (Object): zlib deflate options.
 *
 * Creates new deflator instance with specified params. Throws exception
 * on bad params. Supported options:
 *
 * - `level`
 * - `windowBits`
 * - `memLevel`
 * - `strategy`
 * - `dictionary`
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Additional options, for internal needs:
 *
 * - `chunkSize` - size of generated data chunks (16K by default)
 * - `raw` (Boolean) - do raw deflate
 * - `gzip` (Boolean) - create gzip wrapper
 * - `header` (Object) - custom header for gzip
 *   - `text` (Boolean) - true if compressed data believed to be text
 *   - `time` (Number) - modification time, unix timestamp
 *   - `os` (Number) - operation system code
 *   - `extra` (Array) - array of bytes with extra data (max 65536)
 *   - `name` (String) - file name (binary string)
 *   - `comment` (String) - comment (binary string)
 *   - `hcrc` (Boolean) - true if header crc should be added
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 *   , chunk1 = new Uint8Array([1,2,3,4,5,6,7,8,9])
 *   , chunk2 = new Uint8Array([10,11,12,13,14,15,16,17,18,19]);
 *
 * const deflate = new pako.Deflate({ level: 3});
 *
 * deflate.push(chunk1, false);
 * deflate.push(chunk2, true);  // true -> last chunk
 *
 * if (deflate.err) { throw new Error(deflate.err); }
 *
 * console.log(deflate.result);
 * ```
 **/
function Deflate(options) {
  this.options = utils.assign({
    level: Z_DEFAULT_COMPRESSION,
    method: Z_DEFLATED,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: Z_DEFAULT_STRATEGY
  }, options || {});

  let opt = this.options;

  if (opt.raw && (opt.windowBits > 0)) {
    opt.windowBits = -opt.windowBits;
  }

  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
    opt.windowBits += 16;
  }

  this.err    = 0;      // error code, if happens (0 = Z_OK)
  this.msg    = '';     // error message
  this.ended  = false;  // used to avoid multiple onEnd() calls
  this.chunks = [];     // chunks of compressed data

  this.strm = new ZStream();
  this.strm.avail_out = 0;

  let status = zlib_deflate.deflateInit2(
    this.strm,
    opt.level,
    opt.method,
    opt.windowBits,
    opt.memLevel,
    opt.strategy
  );

  if (status !== Z_OK) {
    throw new Error(msg[status]);
  }

  if (opt.header) {
    zlib_deflate.deflateSetHeader(this.strm, opt.header);
  }

  if (opt.dictionary) {
    let dict;
    // Convert data if needed
    if (typeof opt.dictionary === 'string') {
      // If we need to compress text, change encoding to utf8.
      dict = strings.string2buf(opt.dictionary);
    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
      dict = new Uint8Array(opt.dictionary);
    } else {
      dict = opt.dictionary;
    }

    status = zlib_deflate.deflateSetDictionary(this.strm, dict);

    if (status !== Z_OK) {
      throw new Error(msg[status]);
    }

    this._dict_set = true;
  }
}

/**
 * Deflate#push(data[, flush_mode]) -> Boolean
 * - data (Uint8Array|ArrayBuffer|String): input data. Strings will be
 *   converted to utf8 byte sequence.
 * - flush_mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` means Z_FINISH.
 *
 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
 * new compressed chunks. Returns `true` on success. The last data block must
 * have `flush_mode` Z_FINISH (or `true`). That will flush internal pending
 * buffers and call [[Deflate#onEnd]].
 *
 * On fail call [[Deflate#onEnd]] with error code and return false.
 *
 * ##### Example
 *
 * ```javascript
 * push(chunk, false); // push one of data chunks
 * ...
 * push(chunk, true);  // push last chunk
 * ```
 **/
Deflate.prototype.push = function (data, flush_mode) {
  const strm = this.strm;
  const chunkSize = this.options.chunkSize;
  let status, _flush_mode;

  if (this.ended) { return false; }

  if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
  else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;

  // Convert data if needed
  if (typeof data === 'string') {
    // If we need to compress text, change encoding to utf8.
    strm.input = strings.string2buf(data);
  } else if (toString.call(data) === '[object ArrayBuffer]') {
    strm.input = new Uint8Array(data);
  } else {
    strm.input = data;
  }

  strm.next_in = 0;
  strm.avail_in = strm.input.length;

  for (;;) {
    if (strm.avail_out === 0) {
      strm.output = new Uint8Array(chunkSize);
      strm.next_out = 0;
      strm.avail_out = chunkSize;
    }

    // Make sure avail_out > 6 to avoid repeating markers
    if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    status = zlib_deflate.deflate(strm, _flush_mode);

    // Ended => flush and finish
    if (status === Z_STREAM_END) {
      if (strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
      }
      status = zlib_deflate.deflateEnd(this.strm);
      this.onEnd(status);
      this.ended = true;
      return status === Z_OK;
    }

    // Flush if out buffer full
    if (strm.avail_out === 0) {
      this.onData(strm.output);
      continue;
    }

    // Flush if requested and has data
    if (_flush_mode > 0 && strm.next_out > 0) {
      this.onData(strm.output.subarray(0, strm.next_out));
      strm.avail_out = 0;
      continue;
    }

    if (strm.avail_in === 0) break;
  }

  return true;
};


/**
 * Deflate#onData(chunk) -> Void
 * - chunk (Uint8Array): output data.
 *
 * By default, stores data blocks in `chunks[]` property and glue
 * those in `onEnd`. Override this handler, if you need another behaviour.
 **/
Deflate.prototype.onData = function (chunk) {
  this.chunks.push(chunk);
};


/**
 * Deflate#onEnd(status) -> Void
 * - status (Number): deflate status. 0 (Z_OK) on success,
 *   other if not.
 *
 * Called once after you tell deflate that the input stream is
 * complete (Z_FINISH). By default - join collected chunks,
 * free memory and fill `results` / `err` properties.
 **/
Deflate.prototype.onEnd = function (status) {
  // On success - join
  if (status === Z_OK) {
    this.result = utils.flattenChunks(this.chunks);
  }
  this.chunks = [];
  this.err = status;
  this.msg = this.strm.msg;
};


/**
 * deflate(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * Compress `data` with deflate algorithm and `options`.
 *
 * Supported options are:
 *
 * - level
 * - windowBits
 * - memLevel
 * - strategy
 * - dictionary
 *
 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
 * for more information on these.
 *
 * Sugar (options):
 *
 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
 *   negative windowBits implicitly.
 *
 * ##### Example:
 *
 * ```javascript
 * const pako = require('pako')
 * const data = new Uint8Array([1,2,3,4,5,6,7,8,9]);
 *
 * console.log(pako.deflate(data));
 * ```
 **/
function deflate(input, options) {
  const deflator = new Deflate(options);

  deflator.push(input, true);

  // That will never happens, if you don't cheat with options :)
  if (deflator.err) { throw deflator.msg || msg[deflator.err]; }

  return deflator.result;
}


/**
 * deflateRaw(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but creates raw data, without wrapper
 * (header and adler32 crc).
 **/
function deflateRaw(input, options) {
  options = options || {};
  options.raw = true;
  return deflate(input, options);
}


/**
 * gzip(data[, options]) -> Uint8Array
 * - data (Uint8Array|ArrayBuffer|String): input data to compress.
 * - options (Object): zlib deflate options.
 *
 * The same as [[deflate]], but create gzip wrapper instead of
 * deflate one.
 **/
function gzip(input, options) {
  options = options || {};
  options.gzip = true;
  return deflate(input, options);
}


module.exports.Deflate = Deflate;
module.exports.deflate = deflate;
module.exports.deflateRaw = deflateRaw;
module.exports.gzip = gzip;
module.exports.constants = __webpack_require__(681);


/***/ }),

/***/ 332:
/***/ ((module) => {

"use strict";


// DECODE UTILITIES
function b64ToUint6 (nChr) {
  return nChr > 64 && nChr < 91 ? nChr - 65
    : nChr > 96 && nChr < 123 ? nChr - 71
    : nChr > 47 && nChr < 58 ? nChr + 4
    : nChr === 43 ? 62
    : nChr === 47 ? 63
    : 0
}

// Decode Base64 to Uint8Array
// ---------------------------
function decode (sBase64, nBlocksSize) {
  var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, '')
  var nInLen = sB64Enc.length
  var nOutLen = nBlocksSize
    ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
    : nInLen * 3 + 1 >> 2
  var taBytes = new Uint8Array(nOutLen)

  for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3
    nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255
      }
      nUint24 = 0
    }
  }
  return taBytes
}

module.exports = { decode: decode }


/***/ }),

/***/ 346:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('[19970,19972,19973,19974,19983,19986,19991,19999,20000,20001,20003,20006,20009,20014,20015,20017,20019,20021,20023,20028,20032,20033,20034,20036,20038,20042,20049,20053,20055,20058,20059,20066,20067,20068,20069,20071,20072,20074,20075,20076,20077,20078,20079,20082,20084,20085,20086,20087,20088,20089,20090,20091,20092,20093,20095,20096,20097,20098,20099,20100,20101,20103,20106,0,20112,20118,20119,20121,20124,20125,20126,20131,20138,20143,20144,20145,20148,20150,20151,20152,20153,20156,20157,20158,20168,20172,20175,20176,20178,20186,20187,20188,20192,20194,20198,20199,20201,20205,20206,20207,20209,20212,20216,20217,20218,20220,20222,20224,20226,20227,20228,20229,20230,20231,20232,20235,20236,20242,20243,20244,20245,20246,20252,20253,20257,20259,20264,20265,20268,20269,20270,20273,20275,20277,20279,20281,20283,20286,20287,20288,20289,20290,20292,20293,20295,20296,20297,20298,20299,20300,20306,20308,20310,20321,20322,20326,20328,20330,20331,20333,20334,20337,20338,20341,20343,20344,20345,20346,20349,20352,20353,20354,20357,20358,20359,20362,20364,20366,20368,20370,20371,20373,20374,20376,20377,20378,20380,20382,20383,20385,20386,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20388,20395,20397,20400,20401,20402,20403,20404,20406,20407,20408,20409,20410,20411,20412,20413,20414,20416,20417,20418,20422,20423,20424,20425,20427,20428,20429,20434,20435,20436,20437,20438,20441,20443,20448,20450,20452,20453,20455,20459,20460,20464,20466,20468,20469,20470,20471,20473,20475,20476,20477,20479,20480,20481,20482,20483,20484,20485,20486,20487,20488,20489,20490,0,20491,20494,20496,20497,20499,20501,20502,20503,20507,20509,20510,20512,20514,20515,20516,20519,20523,20527,20528,20529,20530,20531,20532,20533,20534,20535,20536,20537,20539,20541,20543,20544,20545,20546,20548,20549,20550,20553,20554,20555,20557,20560,20561,20562,20563,20564,20566,20567,20568,20569,20571,20573,20574,20575,20576,20577,20578,20579,20580,20582,20583,20584,20585,20586,20587,20589,20590,20591,20592,20593,20594,20595,20596,20597,20600,20601,20602,20604,20605,20609,20610,20611,20612,20614,20615,20617,20618,20619,20620,20622,20623,20624,20625,20626,20627,20628,20629,20630,20631,20632,20633,20634,20635,20636,20637,20638,20639,20640,20641,20642,20644,20646,20650,20651,20653,20654,20655,20656,20657,20659,20660,20661,20662,20663,20664,20665,20668,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20669,20670,20671,20672,20673,20674,20675,20676,20677,20678,20679,20680,20681,20682,20683,20684,20685,20686,20688,20689,20690,20691,20692,20693,20695,20696,20697,20699,20700,20701,20702,20703,20704,20705,20706,20707,20708,20709,20712,20713,20714,20715,20719,20720,20721,20722,20724,20726,20727,20728,20729,20730,20732,20733,20734,20735,20736,20737,20738,20739,20740,20741,20744,0,20745,20746,20748,20749,20750,20751,20752,20753,20755,20756,20757,20758,20759,20760,20761,20762,20763,20764,20765,20766,20767,20768,20770,20771,20772,20773,20774,20775,20776,20777,20778,20779,20780,20781,20782,20783,20784,20785,20786,20787,20788,20789,20790,20791,20792,20793,20794,20795,20796,20797,20798,20802,20807,20810,20812,20814,20815,20816,20818,20819,20823,20824,20825,20827,20829,20830,20831,20832,20833,20835,20836,20838,20839,20841,20842,20847,20850,20858,20862,20863,20867,20868,20870,20871,20874,20875,20878,20879,20880,20881,20883,20884,20888,20890,20893,20894,20895,20897,20899,20902,20903,20904,20905,20906,20909,20910,20916,20920,20921,20922,20926,20927,20929,20930,20931,20933,20936,20938,20941,20942,20944,20946,20947,20948,20949,20950,20951,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20952,20953,20954,20956,20958,20959,20962,20963,20965,20966,20967,20968,20969,20970,20972,20974,20977,20978,20980,20983,20990,20996,20997,21001,21003,21004,21007,21008,21011,21012,21013,21020,21022,21023,21025,21026,21027,21029,21030,21031,21034,21036,21039,21041,21042,21044,21045,21052,21054,21060,21061,21062,21063,21064,21065,21067,21070,21071,21074,21075,21077,21079,21080,0,21081,21082,21083,21085,21087,21088,21090,21091,21092,21094,21096,21099,21100,21101,21102,21104,21105,21107,21108,21109,21110,21111,21112,21113,21114,21115,21116,21118,21120,21123,21124,21125,21126,21127,21129,21130,21131,21132,21133,21134,21135,21137,21138,21140,21141,21142,21143,21144,21145,21146,21148,21156,21157,21158,21159,21166,21167,21168,21172,21173,21174,21175,21176,21177,21178,21179,21180,21181,21184,21185,21186,21188,21189,21190,21192,21194,21196,21197,21198,21199,21201,21203,21204,21205,21207,21209,21210,21211,21212,21213,21214,21216,21217,21218,21219,21221,21222,21223,21224,21225,21226,21227,21228,21229,21230,21231,21233,21234,21235,21236,21237,21238,21239,21240,21243,21244,21245,21249,21250,21251,21252,21255,21257,21258,21259,21260,21262,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21265,21266,21267,21268,21272,21275,21276,21278,21279,21282,21284,21285,21287,21288,21289,21291,21292,21293,21295,21296,21297,21298,21299,21300,21301,21302,21303,21304,21308,21309,21312,21314,21316,21318,21323,21324,21325,21328,21332,21336,21337,21339,21341,21349,21352,21354,21356,21357,21362,21366,21369,21371,21372,21373,21374,21376,21377,21379,21383,21384,21386,21390,21391,0,21392,21393,21394,21395,21396,21398,21399,21401,21403,21404,21406,21408,21409,21412,21415,21418,21419,21420,21421,21423,21424,21425,21426,21427,21428,21429,21431,21432,21433,21434,21436,21437,21438,21440,21443,21444,21445,21446,21447,21454,21455,21456,21458,21459,21461,21466,21468,21469,21470,21473,21474,21479,21492,21498,21502,21503,21504,21506,21509,21511,21515,21524,21528,21529,21530,21532,21538,21540,21541,21546,21552,21555,21558,21559,21562,21565,21567,21569,21570,21572,21573,21575,21577,21580,21581,21582,21583,21585,21594,21597,21598,21599,21600,21601,21603,21605,21607,21609,21610,21611,21612,21613,21614,21615,21616,21620,21625,21626,21630,21631,21633,21635,21637,21639,21640,21641,21642,21645,21649,21651,21655,21656,21660,21662,21663,21664,21665,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,21666,21669,21678,21680,21682,21685,21686,21687,21689,21690,21692,21694,21699,21701,21706,21707,21718,21720,21723,21728,21729,21730,21731,21732,21739,21740,21743,21744,21745,21748,21749,21750,21751,21752,21753,21755,21758,21760,21762,21763,21764,21765,21768,21770,21771,21772,21773,21774,21778,21779,21781,21782,21783,21784,21785,21786,21788,21789,21790,21791,21793,21797,21798,0,21800,21801,21803,21805,21810,21812,21813,21814,21816,21817,21818,21819,21821,21824,21826,21829,21831,21832,21835,21836,21837,21838,21839,21841,21842,21843,21844,21847,21848,21849,21850,21851,21853,21854,21855,21856,21858,21859,21864,21865,21867,21871,21872,21873,21874,21875,21876,21881,21882,21885,21887,21893,21894,21900,21901,21902,21904,21906,21907,21909,21910,21911,21914,21915,21918,21920,21921,21922,21923,21924,21925,21926,21928,21929,21930,21931,21932,21933,21934,21935,21936,21938,21940,21942,21944,21946,21948,21951,21952,21953,21954,21955,21958,21959,21960,21962,21963,21966,21967,21968,21973,21975,21976,21977,21978,21979,21982,21984,21986,21991,21993,21997,21998,22000,22001,22004,22006,22008,22009,22010,22011,22012,22015,22018,22019,22020,22021,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22022,22023,22026,22027,22029,22032,22033,22034,22035,22036,22037,22038,22039,22041,22042,22044,22045,22048,22049,22050,22053,22054,22056,22057,22058,22059,22062,22063,22064,22067,22069,22071,22072,22074,22076,22077,22078,22080,22081,22082,22083,22084,22085,22086,22087,22088,22089,22090,22091,22095,22096,22097,22098,22099,22101,22102,22106,22107,22109,22110,22111,22112,22113,0,22115,22117,22118,22119,22125,22126,22127,22128,22130,22131,22132,22133,22135,22136,22137,22138,22141,22142,22143,22144,22145,22146,22147,22148,22151,22152,22153,22154,22155,22156,22157,22160,22161,22162,22164,22165,22166,22167,22168,22169,22170,22171,22172,22173,22174,22175,22176,22177,22178,22180,22181,22182,22183,22184,22185,22186,22187,22188,22189,22190,22192,22193,22194,22195,22196,22197,22198,22200,22201,22202,22203,22205,22206,22207,22208,22209,22210,22211,22212,22213,22214,22215,22216,22217,22219,22220,22221,22222,22223,22224,22225,22226,22227,22229,22230,22232,22233,22236,22243,22245,22246,22247,22248,22249,22250,22252,22254,22255,22258,22259,22262,22263,22264,22267,22268,22272,22273,22274,22277,22279,22283,22284,22285,22286,22287,22288,22289,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22290,22291,22292,22293,22294,22295,22296,22297,22298,22299,22301,22302,22304,22305,22306,22308,22309,22310,22311,22315,22321,22322,22324,22325,22326,22327,22328,22332,22333,22335,22337,22339,22340,22341,22342,22344,22345,22347,22354,22355,22356,22357,22358,22360,22361,22370,22371,22373,22375,22380,22382,22384,22385,22386,22388,22389,22392,22393,22394,22397,22398,22399,22400,0,22401,22407,22408,22409,22410,22413,22414,22415,22416,22417,22420,22421,22422,22423,22424,22425,22426,22428,22429,22430,22431,22437,22440,22442,22444,22447,22448,22449,22451,22453,22454,22455,22457,22458,22459,22460,22461,22462,22463,22464,22465,22468,22469,22470,22471,22472,22473,22474,22476,22477,22480,22481,22483,22486,22487,22491,22492,22494,22497,22498,22499,22501,22502,22503,22504,22505,22506,22507,22508,22510,22512,22513,22514,22515,22517,22518,22519,22523,22524,22526,22527,22529,22531,22532,22533,22536,22537,22538,22540,22542,22543,22544,22546,22547,22548,22550,22551,22552,22554,22555,22556,22557,22559,22562,22563,22565,22566,22567,22568,22569,22571,22572,22573,22574,22575,22577,22578,22579,22580,22582,22583,22584,22585,22586,22587,22588,22589,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22590,22591,22592,22593,22594,22595,22597,22598,22599,22600,22601,22602,22603,22606,22607,22608,22610,22611,22613,22614,22615,22617,22618,22619,22620,22621,22623,22624,22625,22626,22627,22628,22630,22631,22632,22633,22634,22637,22638,22639,22640,22641,22642,22643,22644,22645,22646,22647,22648,22649,22650,22651,22652,22653,22655,22658,22660,22662,22663,22664,22666,22667,22668,0,22669,22670,22671,22672,22673,22676,22677,22678,22679,22680,22683,22684,22685,22688,22689,22690,22691,22692,22693,22694,22695,22698,22699,22700,22701,22702,22703,22704,22705,22706,22707,22708,22709,22710,22711,22712,22713,22714,22715,22717,22718,22719,22720,22722,22723,22724,22726,22727,22728,22729,22730,22731,22732,22733,22734,22735,22736,22738,22739,22740,22742,22743,22744,22745,22746,22747,22748,22749,22750,22751,22752,22753,22754,22755,22757,22758,22759,22760,22761,22762,22765,22767,22769,22770,22772,22773,22775,22776,22778,22779,22780,22781,22782,22783,22784,22785,22787,22789,22790,22792,22793,22794,22795,22796,22798,22800,22801,22802,22803,22807,22808,22811,22813,22814,22816,22817,22818,22819,22822,22824,22828,22832,22834,22835,22837,22838,22843,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22845,22846,22847,22848,22851,22853,22854,22858,22860,22861,22864,22866,22867,22873,22875,22876,22877,22878,22879,22881,22883,22884,22886,22887,22888,22889,22890,22891,22892,22893,22894,22895,22896,22897,22898,22901,22903,22906,22907,22908,22910,22911,22912,22917,22921,22923,22924,22926,22927,22928,22929,22932,22933,22936,22938,22939,22940,22941,22943,22944,22945,22946,22950,0,22951,22956,22957,22960,22961,22963,22964,22965,22966,22967,22968,22970,22972,22973,22975,22976,22977,22978,22979,22980,22981,22983,22984,22985,22988,22989,22990,22991,22997,22998,23001,23003,23006,23007,23008,23009,23010,23012,23014,23015,23017,23018,23019,23021,23022,23023,23024,23025,23026,23027,23028,23029,23030,23031,23032,23034,23036,23037,23038,23040,23042,23050,23051,23053,23054,23055,23056,23058,23060,23061,23062,23063,23065,23066,23067,23069,23070,23073,23074,23076,23078,23079,23080,23082,23083,23084,23085,23086,23087,23088,23091,23093,23095,23096,23097,23098,23099,23101,23102,23103,23105,23106,23107,23108,23109,23111,23112,23115,23116,23117,23118,23119,23120,23121,23122,23123,23124,23126,23127,23128,23129,23131,23132,23133,23134,23135,23136,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23137,23139,23140,23141,23142,23144,23145,23147,23148,23149,23150,23151,23152,23153,23154,23155,23160,23161,23163,23164,23165,23166,23168,23169,23170,23171,23172,23173,23174,23175,23176,23177,23178,23179,23180,23181,23182,23183,23184,23185,23187,23188,23189,23190,23191,23192,23193,23196,23197,23198,23199,23200,23201,23202,23203,23204,23205,23206,23207,23208,23209,23211,23212,0,23213,23214,23215,23216,23217,23220,23222,23223,23225,23226,23227,23228,23229,23231,23232,23235,23236,23237,23238,23239,23240,23242,23243,23245,23246,23247,23248,23249,23251,23253,23255,23257,23258,23259,23261,23262,23263,23266,23268,23269,23271,23272,23274,23276,23277,23278,23279,23280,23282,23283,23284,23285,23286,23287,23288,23289,23290,23291,23292,23293,23294,23295,23296,23297,23298,23299,23300,23301,23302,23303,23304,23306,23307,23308,23309,23310,23311,23312,23313,23314,23315,23316,23317,23320,23321,23322,23323,23324,23325,23326,23327,23328,23329,23330,23331,23332,23333,23334,23335,23336,23337,23338,23339,23340,23341,23342,23343,23344,23345,23347,23349,23350,23352,23353,23354,23355,23356,23357,23358,23359,23361,23362,23363,23364,23365,23366,23367,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23368,23369,23370,23371,23372,23373,23374,23375,23378,23382,23390,23392,23393,23399,23400,23403,23405,23406,23407,23410,23412,23414,23415,23416,23417,23419,23420,23422,23423,23426,23430,23434,23437,23438,23440,23441,23442,23444,23446,23455,23463,23464,23465,23468,23469,23470,23471,23473,23474,23479,23482,23483,23484,23488,23489,23491,23496,23497,23498,23499,23501,23502,23503,0,23505,23508,23509,23510,23511,23512,23513,23514,23515,23516,23520,23522,23523,23526,23527,23529,23530,23531,23532,23533,23535,23537,23538,23539,23540,23541,23542,23543,23549,23550,23552,23554,23555,23557,23559,23560,23563,23564,23565,23566,23568,23570,23571,23575,23577,23579,23582,23583,23584,23585,23587,23590,23592,23593,23594,23595,23597,23598,23599,23600,23602,23603,23605,23606,23607,23619,23620,23622,23623,23628,23629,23634,23635,23636,23638,23639,23640,23642,23643,23644,23645,23647,23650,23652,23655,23656,23657,23658,23659,23660,23661,23664,23666,23667,23668,23669,23670,23671,23672,23675,23676,23677,23678,23680,23683,23684,23685,23686,23687,23689,23690,23691,23694,23695,23698,23699,23701,23709,23710,23711,23712,23713,23716,23717,23718,23719,23720,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23722,23726,23727,23728,23730,23732,23734,23737,23738,23739,23740,23742,23744,23746,23747,23749,23750,23751,23752,23753,23754,23756,23757,23758,23759,23760,23761,23763,23764,23765,23766,23767,23768,23770,23771,23772,23773,23774,23775,23776,23778,23779,23783,23785,23787,23788,23790,23791,23793,23794,23795,23796,23797,23798,23799,23800,23801,23802,23804,23805,23806,23807,23808,0,23809,23812,23813,23816,23817,23818,23819,23820,23821,23823,23824,23825,23826,23827,23829,23831,23832,23833,23834,23836,23837,23839,23840,23841,23842,23843,23845,23848,23850,23851,23852,23855,23856,23857,23858,23859,23861,23862,23863,23864,23865,23866,23867,23868,23871,23872,23873,23874,23875,23876,23877,23878,23880,23881,23885,23886,23887,23888,23889,23890,23891,23892,23893,23894,23895,23897,23898,23900,23902,23903,23904,23905,23906,23907,23908,23909,23910,23911,23912,23914,23917,23918,23920,23921,23922,23923,23925,23926,23927,23928,23929,23930,23931,23932,23933,23934,23935,23936,23937,23939,23940,23941,23942,23943,23944,23945,23946,23947,23948,23949,23950,23951,23952,23953,23954,23955,23956,23957,23958,23959,23960,23962,23963,23964,23966,23967,23968,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,23969,23970,23971,23972,23973,23974,23975,23976,23977,23978,23979,23980,23981,23982,23983,23984,23985,23986,23987,23988,23989,23990,23992,23993,23994,23995,23996,23997,23998,23999,24000,24001,24002,24003,24004,24006,24007,24008,24009,24010,24011,24012,24014,24015,24016,24017,24018,24019,24020,24021,24022,24023,24024,24025,24026,24028,24031,24032,24035,24036,24042,24044,24045,0,24048,24053,24054,24056,24057,24058,24059,24060,24063,24064,24068,24071,24073,24074,24075,24077,24078,24082,24083,24087,24094,24095,24096,24097,24098,24099,24100,24101,24104,24105,24106,24107,24108,24111,24112,24114,24115,24116,24117,24118,24121,24122,24126,24127,24128,24129,24131,24134,24135,24136,24137,24138,24139,24141,24142,24143,24144,24145,24146,24147,24150,24151,24152,24153,24154,24156,24157,24159,24160,24163,24164,24165,24166,24167,24168,24169,24170,24171,24172,24173,24174,24175,24176,24177,24181,24183,24185,24190,24193,24194,24195,24197,24200,24201,24204,24205,24206,24210,24216,24219,24221,24225,24226,24227,24228,24232,24233,24234,24235,24236,24238,24239,24240,24241,24242,24244,24250,24251,24252,24253,24255,24256,24257,24258,24259,24260,24261,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24262,24263,24264,24267,24268,24269,24270,24271,24272,24276,24277,24279,24280,24281,24282,24284,24285,24286,24287,24288,24289,24290,24291,24292,24293,24294,24295,24297,24299,24300,24301,24302,24303,24304,24305,24306,24307,24309,24312,24313,24315,24316,24317,24325,24326,24327,24329,24332,24333,24334,24336,24338,24340,24342,24345,24346,24348,24349,24350,24353,24354,24355,24356,0,24360,24363,24364,24366,24368,24370,24371,24372,24373,24374,24375,24376,24379,24381,24382,24383,24385,24386,24387,24388,24389,24390,24391,24392,24393,24394,24395,24396,24397,24398,24399,24401,24404,24409,24410,24411,24412,24414,24415,24416,24419,24421,24423,24424,24427,24430,24431,24434,24436,24437,24438,24440,24442,24445,24446,24447,24451,24454,24461,24462,24463,24465,24467,24468,24470,24474,24475,24477,24478,24479,24480,24482,24483,24484,24485,24486,24487,24489,24491,24492,24495,24496,24497,24498,24499,24500,24502,24504,24505,24506,24507,24510,24511,24512,24513,24514,24519,24520,24522,24523,24526,24531,24532,24533,24538,24539,24540,24542,24543,24546,24547,24549,24550,24552,24553,24556,24559,24560,24562,24563,24564,24566,24567,24569,24570,24572,24583,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24584,24585,24587,24588,24592,24593,24595,24599,24600,24602,24606,24607,24610,24611,24612,24620,24621,24622,24624,24625,24626,24627,24628,24630,24631,24632,24633,24634,24637,24638,24640,24644,24645,24646,24647,24648,24649,24650,24652,24654,24655,24657,24659,24660,24662,24663,24664,24667,24668,24670,24671,24672,24673,24677,24678,24686,24689,24690,24692,24693,24695,24702,24704,0,24705,24706,24709,24710,24711,24712,24714,24715,24718,24719,24720,24721,24723,24725,24727,24728,24729,24732,24734,24737,24738,24740,24741,24743,24745,24746,24750,24752,24755,24757,24758,24759,24761,24762,24765,24766,24767,24768,24769,24770,24771,24772,24775,24776,24777,24780,24781,24782,24783,24784,24786,24787,24788,24790,24791,24793,24795,24798,24801,24802,24803,24804,24805,24810,24817,24818,24821,24823,24824,24827,24828,24829,24830,24831,24834,24835,24836,24837,24839,24842,24843,24844,24848,24849,24850,24851,24852,24854,24855,24856,24857,24859,24860,24861,24862,24865,24866,24869,24872,24873,24874,24876,24877,24878,24879,24880,24881,24882,24883,24884,24885,24886,24887,24888,24889,24890,24891,24892,24893,24894,24896,24897,24898,24899,24900,24901,24902,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,24903,24905,24907,24909,24911,24912,24914,24915,24916,24918,24919,24920,24921,24922,24923,24924,24926,24927,24928,24929,24931,24932,24933,24934,24937,24938,24939,24940,24941,24942,24943,24945,24946,24947,24948,24950,24952,24953,24954,24955,24956,24957,24958,24959,24960,24961,24962,24963,24964,24965,24966,24967,24968,24969,24970,24972,24973,24975,24976,24977,24978,24979,24981,0,24982,24983,24984,24985,24986,24987,24988,24990,24991,24992,24993,24994,24995,24996,24997,24998,25002,25003,25005,25006,25007,25008,25009,25010,25011,25012,25013,25014,25016,25017,25018,25019,25020,25021,25023,25024,25025,25027,25028,25029,25030,25031,25033,25036,25037,25038,25039,25040,25043,25045,25046,25047,25048,25049,25050,25051,25052,25053,25054,25055,25056,25057,25058,25059,25060,25061,25063,25064,25065,25066,25067,25068,25069,25070,25071,25072,25073,25074,25075,25076,25078,25079,25080,25081,25082,25083,25084,25085,25086,25088,25089,25090,25091,25092,25093,25095,25097,25107,25108,25113,25116,25117,25118,25120,25123,25126,25127,25128,25129,25131,25133,25135,25136,25137,25138,25141,25142,25144,25145,25146,25147,25148,25154,25156,25157,25158,25162,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25167,25168,25173,25174,25175,25177,25178,25180,25181,25182,25183,25184,25185,25186,25188,25189,25192,25201,25202,25204,25205,25207,25208,25210,25211,25213,25217,25218,25219,25221,25222,25223,25224,25227,25228,25229,25230,25231,25232,25236,25241,25244,25245,25246,25251,25254,25255,25257,25258,25261,25262,25263,25264,25266,25267,25268,25270,25271,25272,25274,25278,25280,25281,0,25283,25291,25295,25297,25301,25309,25310,25312,25313,25316,25322,25323,25328,25330,25333,25336,25337,25338,25339,25344,25347,25348,25349,25350,25354,25355,25356,25357,25359,25360,25362,25363,25364,25365,25367,25368,25369,25372,25382,25383,25385,25388,25389,25390,25392,25393,25395,25396,25397,25398,25399,25400,25403,25404,25406,25407,25408,25409,25412,25415,25416,25418,25425,25426,25427,25428,25430,25431,25432,25433,25434,25435,25436,25437,25440,25444,25445,25446,25448,25450,25451,25452,25455,25456,25458,25459,25460,25461,25464,25465,25468,25469,25470,25471,25473,25475,25476,25477,25478,25483,25485,25489,25491,25492,25493,25495,25497,25498,25499,25500,25501,25502,25503,25505,25508,25510,25515,25519,25521,25522,25525,25526,25529,25531,25533,25535,25536,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25537,25538,25539,25541,25543,25544,25546,25547,25548,25553,25555,25556,25557,25559,25560,25561,25562,25563,25564,25565,25567,25570,25572,25573,25574,25575,25576,25579,25580,25582,25583,25584,25585,25587,25589,25591,25593,25594,25595,25596,25598,25603,25604,25606,25607,25608,25609,25610,25613,25614,25617,25618,25621,25622,25623,25624,25625,25626,25629,25631,25634,25635,25636,0,25637,25639,25640,25641,25643,25646,25647,25648,25649,25650,25651,25653,25654,25655,25656,25657,25659,25660,25662,25664,25666,25667,25673,25675,25676,25677,25678,25679,25680,25681,25683,25685,25686,25687,25689,25690,25691,25692,25693,25695,25696,25697,25698,25699,25700,25701,25702,25704,25706,25707,25708,25710,25711,25712,25713,25714,25715,25716,25717,25718,25719,25723,25724,25725,25726,25727,25728,25729,25731,25734,25736,25737,25738,25739,25740,25741,25742,25743,25744,25747,25748,25751,25752,25754,25755,25756,25757,25759,25760,25761,25762,25763,25765,25766,25767,25768,25770,25771,25775,25777,25778,25779,25780,25782,25785,25787,25789,25790,25791,25793,25795,25796,25798,25799,25800,25801,25802,25803,25804,25807,25809,25811,25812,25813,25814,25817,25818,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25819,25820,25821,25823,25824,25825,25827,25829,25831,25832,25833,25834,25835,25836,25837,25838,25839,25840,25841,25842,25843,25844,25845,25846,25847,25848,25849,25850,25851,25852,25853,25854,25855,25857,25858,25859,25860,25861,25862,25863,25864,25866,25867,25868,25869,25870,25871,25872,25873,25875,25876,25877,25878,25879,25881,25882,25883,25884,25885,25886,25887,25888,25889,0,25890,25891,25892,25894,25895,25896,25897,25898,25900,25901,25904,25905,25906,25907,25911,25914,25916,25917,25920,25921,25922,25923,25924,25926,25927,25930,25931,25933,25934,25936,25938,25939,25940,25943,25944,25946,25948,25951,25952,25953,25956,25957,25959,25960,25961,25962,25965,25966,25967,25969,25971,25973,25974,25976,25977,25978,25979,25980,25981,25982,25983,25984,25985,25986,25987,25988,25989,25990,25992,25993,25994,25997,25998,25999,26002,26004,26005,26006,26008,26010,26013,26014,26016,26018,26019,26022,26024,26026,26028,26030,26033,26034,26035,26036,26037,26038,26039,26040,26042,26043,26046,26047,26048,26050,26055,26056,26057,26058,26061,26064,26065,26067,26068,26069,26072,26073,26074,26075,26076,26077,26078,26079,26081,26083,26084,26090,26091,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26098,26099,26100,26101,26104,26105,26107,26108,26109,26110,26111,26113,26116,26117,26119,26120,26121,26123,26125,26128,26129,26130,26134,26135,26136,26138,26139,26140,26142,26145,26146,26147,26148,26150,26153,26154,26155,26156,26158,26160,26162,26163,26167,26168,26169,26170,26171,26173,26175,26176,26178,26180,26181,26182,26183,26184,26185,26186,26189,26190,26192,26193,26200,0,26201,26203,26204,26205,26206,26208,26210,26211,26213,26215,26217,26218,26219,26220,26221,26225,26226,26227,26229,26232,26233,26235,26236,26237,26239,26240,26241,26243,26245,26246,26248,26249,26250,26251,26253,26254,26255,26256,26258,26259,26260,26261,26264,26265,26266,26267,26268,26270,26271,26272,26273,26274,26275,26276,26277,26278,26281,26282,26283,26284,26285,26287,26288,26289,26290,26291,26293,26294,26295,26296,26298,26299,26300,26301,26303,26304,26305,26306,26307,26308,26309,26310,26311,26312,26313,26314,26315,26316,26317,26318,26319,26320,26321,26322,26323,26324,26325,26326,26327,26328,26330,26334,26335,26336,26337,26338,26339,26340,26341,26343,26344,26346,26347,26348,26349,26350,26351,26353,26357,26358,26360,26362,26363,26365,26369,26370,26371,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26372,26373,26374,26375,26380,26382,26383,26385,26386,26387,26390,26392,26393,26394,26396,26398,26400,26401,26402,26403,26404,26405,26407,26409,26414,26416,26418,26419,26422,26423,26424,26425,26427,26428,26430,26431,26433,26436,26437,26439,26442,26443,26445,26450,26452,26453,26455,26456,26457,26458,26459,26461,26466,26467,26468,26470,26471,26475,26476,26478,26481,26484,26486,0,26488,26489,26490,26491,26493,26496,26498,26499,26501,26502,26504,26506,26508,26509,26510,26511,26513,26514,26515,26516,26518,26521,26523,26527,26528,26529,26532,26534,26537,26540,26542,26545,26546,26548,26553,26554,26555,26556,26557,26558,26559,26560,26562,26565,26566,26567,26568,26569,26570,26571,26572,26573,26574,26581,26582,26583,26587,26591,26593,26595,26596,26598,26599,26600,26602,26603,26605,26606,26610,26613,26614,26615,26616,26617,26618,26619,26620,26622,26625,26626,26627,26628,26630,26637,26640,26642,26644,26645,26648,26649,26650,26651,26652,26654,26655,26656,26658,26659,26660,26661,26662,26663,26664,26667,26668,26669,26670,26671,26672,26673,26676,26677,26678,26682,26683,26687,26695,26699,26701,26703,26706,26710,26711,26712,26713,26714,26715,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26716,26717,26718,26719,26730,26732,26733,26734,26735,26736,26737,26738,26739,26741,26744,26745,26746,26747,26748,26749,26750,26751,26752,26754,26756,26759,26760,26761,26762,26763,26764,26765,26766,26768,26769,26770,26772,26773,26774,26776,26777,26778,26779,26780,26781,26782,26783,26784,26785,26787,26788,26789,26793,26794,26795,26796,26798,26801,26802,26804,26806,26807,26808,0,26809,26810,26811,26812,26813,26814,26815,26817,26819,26820,26821,26822,26823,26824,26826,26828,26830,26831,26832,26833,26835,26836,26838,26839,26841,26843,26844,26845,26846,26847,26849,26850,26852,26853,26854,26855,26856,26857,26858,26859,26860,26861,26863,26866,26867,26868,26870,26871,26872,26875,26877,26878,26879,26880,26882,26883,26884,26886,26887,26888,26889,26890,26892,26895,26897,26899,26900,26901,26902,26903,26904,26905,26906,26907,26908,26909,26910,26913,26914,26915,26917,26918,26919,26920,26921,26922,26923,26924,26926,26927,26929,26930,26931,26933,26934,26935,26936,26938,26939,26940,26942,26944,26945,26947,26948,26949,26950,26951,26952,26953,26954,26955,26956,26957,26958,26959,26960,26961,26962,26963,26965,26966,26968,26969,26971,26972,26975,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,26977,26978,26980,26981,26983,26984,26985,26986,26988,26989,26991,26992,26994,26995,26996,26997,26998,27002,27003,27005,27006,27007,27009,27011,27013,27018,27019,27020,27022,27023,27024,27025,27026,27027,27030,27031,27033,27034,27037,27038,27039,27040,27041,27042,27043,27044,27045,27046,27049,27050,27052,27054,27055,27056,27058,27059,27061,27062,27064,27065,27066,27068,27069,0,27070,27071,27072,27074,27075,27076,27077,27078,27079,27080,27081,27083,27085,27087,27089,27090,27091,27093,27094,27095,27096,27097,27098,27100,27101,27102,27105,27106,27107,27108,27109,27110,27111,27112,27113,27114,27115,27116,27118,27119,27120,27121,27123,27124,27125,27126,27127,27128,27129,27130,27131,27132,27134,27136,27137,27138,27139,27140,27141,27142,27143,27144,27145,27147,27148,27149,27150,27151,27152,27153,27154,27155,27156,27157,27158,27161,27162,27163,27164,27165,27166,27168,27170,27171,27172,27173,27174,27175,27177,27179,27180,27181,27182,27184,27186,27187,27188,27190,27191,27192,27193,27194,27195,27196,27199,27200,27201,27202,27203,27205,27206,27208,27209,27210,27211,27212,27213,27214,27215,27217,27218,27219,27220,27221,27222,27223,27226,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27228,27229,27230,27231,27232,27234,27235,27236,27238,27239,27240,27241,27242,27243,27244,27245,27246,27247,27248,27250,27251,27252,27253,27254,27255,27256,27258,27259,27261,27262,27263,27265,27266,27267,27269,27270,27271,27272,27273,27274,27275,27276,27277,27279,27282,27283,27284,27285,27286,27288,27289,27290,27291,27292,27293,27294,27295,27297,27298,27299,27300,27301,27302,0,27303,27304,27306,27309,27310,27311,27312,27313,27314,27315,27316,27317,27318,27319,27320,27321,27322,27323,27324,27325,27326,27327,27328,27329,27330,27331,27332,27333,27334,27335,27336,27337,27338,27339,27340,27341,27342,27343,27344,27345,27346,27347,27348,27349,27350,27351,27352,27353,27354,27355,27356,27357,27358,27359,27360,27361,27362,27363,27364,27365,27366,27367,27368,27369,27370,27371,27372,27373,27374,27375,27376,27377,27378,27379,27380,27381,27382,27383,27384,27385,27386,27387,27388,27389,27390,27391,27392,27393,27394,27395,27396,27397,27398,27399,27400,27401,27402,27403,27404,27405,27406,27407,27408,27409,27410,27411,27412,27413,27414,27415,27416,27417,27418,27419,27420,27421,27422,27423,27429,27430,27432,27433,27434,27435,27436,27437,27438,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27439,27440,27441,27443,27444,27445,27446,27448,27451,27452,27453,27455,27456,27457,27458,27460,27461,27464,27466,27467,27469,27470,27471,27472,27473,27474,27475,27476,27477,27478,27479,27480,27482,27483,27484,27485,27486,27487,27488,27489,27496,27497,27499,27500,27501,27502,27503,27504,27505,27506,27507,27508,27509,27510,27511,27512,27514,27517,27518,27519,27520,27525,27528,0,27532,27534,27535,27536,27537,27540,27541,27543,27544,27545,27548,27549,27550,27551,27552,27554,27555,27556,27557,27558,27559,27560,27561,27563,27564,27565,27566,27567,27568,27569,27570,27574,27576,27577,27578,27579,27580,27581,27582,27584,27587,27588,27590,27591,27592,27593,27594,27596,27598,27600,27601,27608,27610,27612,27613,27614,27615,27616,27618,27619,27620,27621,27622,27623,27624,27625,27628,27629,27630,27632,27633,27634,27636,27638,27639,27640,27642,27643,27644,27646,27647,27648,27649,27650,27651,27652,27656,27657,27658,27659,27660,27662,27666,27671,27676,27677,27678,27680,27683,27685,27691,27692,27693,27697,27699,27702,27703,27705,27706,27707,27708,27710,27711,27715,27716,27717,27720,27723,27724,27725,27726,27727,27729,27730,27731,27734,27736,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,27737,27738,27746,27747,27749,27750,27751,27755,27756,27757,27758,27759,27761,27763,27765,27767,27768,27770,27771,27772,27775,27776,27780,27783,27786,27787,27789,27790,27793,27794,27797,27798,27799,27800,27802,27804,27805,27806,27808,27810,27816,27820,27823,27824,27828,27829,27830,27831,27834,27840,27841,27842,27843,27846,27847,27848,27851,27853,27854,27855,27857,27858,27864,0,27865,27866,27868,27869,27871,27876,27878,27879,27881,27884,27885,27890,27892,27897,27903,27904,27906,27907,27909,27910,27912,27913,27914,27917,27919,27920,27921,27923,27924,27925,27926,27928,27932,27933,27935,27936,27937,27938,27939,27940,27942,27944,27945,27948,27949,27951,27952,27956,27958,27959,27960,27962,27967,27968,27970,27972,27977,27980,27984,27989,27990,27991,27992,27995,27997,27999,28001,28002,28004,28005,28007,28008,28011,28012,28013,28016,28017,28018,28019,28021,28022,28025,28026,28027,28029,28030,28031,28032,28033,28035,28036,28038,28039,28042,28043,28045,28047,28048,28050,28054,28055,28056,28057,28058,28060,28066,28069,28076,28077,28080,28081,28083,28084,28086,28087,28089,28090,28091,28092,28093,28094,28097,28098,28099,28104,28105,28106,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28109,28110,28111,28112,28114,28115,28116,28117,28119,28122,28123,28124,28127,28130,28131,28133,28135,28136,28137,28138,28141,28143,28144,28146,28148,28149,28150,28152,28154,28157,28158,28159,28160,28161,28162,28163,28164,28166,28167,28168,28169,28171,28175,28178,28179,28181,28184,28185,28187,28188,28190,28191,28194,28198,28199,28200,28202,28204,28206,28208,28209,28211,28213,0,28214,28215,28217,28219,28220,28221,28222,28223,28224,28225,28226,28229,28230,28231,28232,28233,28234,28235,28236,28239,28240,28241,28242,28245,28247,28249,28250,28252,28253,28254,28256,28257,28258,28259,28260,28261,28262,28263,28264,28265,28266,28268,28269,28271,28272,28273,28274,28275,28276,28277,28278,28279,28280,28281,28282,28283,28284,28285,28288,28289,28290,28292,28295,28296,28298,28299,28300,28301,28302,28305,28306,28307,28308,28309,28310,28311,28313,28314,28315,28317,28318,28320,28321,28323,28324,28326,28328,28329,28331,28332,28333,28334,28336,28339,28341,28344,28345,28348,28350,28351,28352,28355,28356,28357,28358,28360,28361,28362,28364,28365,28366,28368,28370,28374,28376,28377,28379,28380,28381,28387,28391,28394,28395,28396,28397,28398,28399,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28400,28401,28402,28403,28405,28406,28407,28408,28410,28411,28412,28413,28414,28415,28416,28417,28419,28420,28421,28423,28424,28426,28427,28428,28429,28430,28432,28433,28434,28438,28439,28440,28441,28442,28443,28444,28445,28446,28447,28449,28450,28451,28453,28454,28455,28456,28460,28462,28464,28466,28468,28469,28471,28472,28473,28474,28475,28476,28477,28479,28480,28481,28482,0,28483,28484,28485,28488,28489,28490,28492,28494,28495,28496,28497,28498,28499,28500,28501,28502,28503,28505,28506,28507,28509,28511,28512,28513,28515,28516,28517,28519,28520,28521,28522,28523,28524,28527,28528,28529,28531,28533,28534,28535,28537,28539,28541,28542,28543,28544,28545,28546,28547,28549,28550,28551,28554,28555,28559,28560,28561,28562,28563,28564,28565,28566,28567,28568,28569,28570,28571,28573,28574,28575,28576,28578,28579,28580,28581,28582,28584,28585,28586,28587,28588,28589,28590,28591,28592,28593,28594,28596,28597,28599,28600,28602,28603,28604,28605,28606,28607,28609,28611,28612,28613,28614,28615,28616,28618,28619,28620,28621,28622,28623,28624,28627,28628,28629,28630,28631,28632,28633,28634,28635,28636,28637,28639,28642,28643,28644,28645,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28646,28647,28648,28649,28650,28651,28652,28653,28656,28657,28658,28659,28660,28661,28662,28663,28664,28665,28666,28667,28668,28669,28670,28671,28672,28673,28674,28675,28676,28677,28678,28679,28680,28681,28682,28683,28684,28685,28686,28687,28688,28690,28691,28692,28693,28694,28695,28696,28697,28700,28701,28702,28703,28704,28705,28706,28708,28709,28710,28711,28712,28713,28714,0,28715,28716,28717,28718,28719,28720,28721,28722,28723,28724,28726,28727,28728,28730,28731,28732,28733,28734,28735,28736,28737,28738,28739,28740,28741,28742,28743,28744,28745,28746,28747,28749,28750,28752,28753,28754,28755,28756,28757,28758,28759,28760,28761,28762,28763,28764,28765,28767,28768,28769,28770,28771,28772,28773,28774,28775,28776,28777,28778,28782,28785,28786,28787,28788,28791,28793,28794,28795,28797,28801,28802,28803,28804,28806,28807,28808,28811,28812,28813,28815,28816,28817,28819,28823,28824,28826,28827,28830,28831,28832,28833,28834,28835,28836,28837,28838,28839,28840,28841,28842,28848,28850,28852,28853,28854,28858,28862,28863,28868,28869,28870,28871,28873,28875,28876,28877,28878,28879,28880,28881,28882,28883,28884,28885,28886,28887,28890,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,28892,28893,28894,28896,28897,28898,28899,28901,28906,28910,28912,28913,28914,28915,28916,28917,28918,28920,28922,28923,28924,28926,28927,28928,28929,28930,28931,28932,28933,28934,28935,28936,28939,28940,28941,28942,28943,28945,28946,28948,28951,28955,28956,28957,28958,28959,28960,28961,28962,28963,28964,28965,28967,28968,28969,28970,28971,28972,28973,28974,28978,28979,28980,0,28981,28983,28984,28985,28986,28987,28988,28989,28990,28991,28992,28993,28994,28995,28996,28998,28999,29000,29001,29003,29005,29007,29008,29009,29010,29011,29012,29013,29014,29015,29016,29017,29018,29019,29021,29023,29024,29025,29026,29027,29029,29033,29034,29035,29036,29037,29039,29040,29041,29044,29045,29046,29047,29049,29051,29052,29054,29055,29056,29057,29058,29059,29061,29062,29063,29064,29065,29067,29068,29069,29070,29072,29073,29074,29075,29077,29078,29079,29082,29083,29084,29085,29086,29089,29090,29091,29092,29093,29094,29095,29097,29098,29099,29101,29102,29103,29104,29105,29106,29108,29110,29111,29112,29114,29115,29116,29117,29118,29119,29120,29121,29122,29124,29125,29126,29127,29128,29129,29130,29131,29132,29133,29135,29136,29137,29138,29139,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29142,29143,29144,29145,29146,29147,29148,29149,29150,29151,29153,29154,29155,29156,29158,29160,29161,29162,29163,29164,29165,29167,29168,29169,29170,29171,29172,29173,29174,29175,29176,29178,29179,29180,29181,29182,29183,29184,29185,29186,29187,29188,29189,29191,29192,29193,29194,29195,29196,29197,29198,29199,29200,29201,29202,29203,29204,29205,29206,29207,29208,29209,29210,0,29211,29212,29214,29215,29216,29217,29218,29219,29220,29221,29222,29223,29225,29227,29229,29230,29231,29234,29235,29236,29242,29244,29246,29248,29249,29250,29251,29252,29253,29254,29257,29258,29259,29262,29263,29264,29265,29267,29268,29269,29271,29272,29274,29276,29278,29280,29283,29284,29285,29288,29290,29291,29292,29293,29296,29297,29299,29300,29302,29303,29304,29307,29308,29309,29314,29315,29317,29318,29319,29320,29321,29324,29326,29328,29329,29331,29332,29333,29334,29335,29336,29337,29338,29339,29340,29341,29342,29344,29345,29346,29347,29348,29349,29350,29351,29352,29353,29354,29355,29358,29361,29362,29363,29365,29370,29371,29372,29373,29374,29375,29376,29381,29382,29383,29385,29386,29387,29388,29391,29393,29395,29396,29397,29398,29400,29402,29403,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12288,12289,12290,183,713,711,168,12291,12293,8212,65374,8214,8230,8216,8217,8220,8221,12308,12309,12296,12297,12298,12299,12300,12301,12302,12303,12310,12311,12304,12305,177,215,247,8758,8743,8744,8721,8719,8746,8745,8712,8759,8730,8869,8741,8736,8978,8857,8747,8750,8801,8780,8776,8765,8733,8800,8814,8815,8804,8805,8734,8757,8756,9794,9792,176,8242,8243,8451,65284,164,65504,65505,8240,167,8470,9734,9733,9675,9679,9678,9671,9670,9633,9632,9651,9650,8251,8594,8592,8593,8595,12307,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8560,8561,8562,8563,8564,8565,8566,8567,8568,8569,0,0,0,0,0,0,9352,9353,9354,9355,9356,9357,9358,9359,9360,9361,9362,9363,9364,9365,9366,9367,9368,9369,9370,9371,9332,9333,9334,9335,9336,9337,9338,9339,9340,9341,9342,9343,9344,9345,9346,9347,9348,9349,9350,9351,9312,9313,9314,9315,9316,9317,9318,9319,9320,9321,0,0,12832,12833,12834,12835,12836,12837,12838,12839,12840,12841,0,0,8544,8545,8546,8547,8548,8549,8550,8551,8552,8553,8554,8555,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,65281,65282,65283,65509,65285,65286,65287,65288,65289,65290,65291,65292,65293,65294,65295,65296,65297,65298,65299,65300,65301,65302,65303,65304,65305,65306,65307,65308,65309,65310,65311,65312,65313,65314,65315,65316,65317,65318,65319,65320,65321,65322,65323,65324,65325,65326,65327,65328,65329,65330,65331,65332,65333,65334,65335,65336,65337,65338,65339,65340,65341,65342,65343,65344,65345,65346,65347,65348,65349,65350,65351,65352,65353,65354,65355,65356,65357,65358,65359,65360,65361,65362,65363,65364,65365,65366,65367,65368,65369,65370,65371,65372,65373,65507,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12353,12354,12355,12356,12357,12358,12359,12360,12361,12362,12363,12364,12365,12366,12367,12368,12369,12370,12371,12372,12373,12374,12375,12376,12377,12378,12379,12380,12381,12382,12383,12384,12385,12386,12387,12388,12389,12390,12391,12392,12393,12394,12395,12396,12397,12398,12399,12400,12401,12402,12403,12404,12405,12406,12407,12408,12409,12410,12411,12412,12413,12414,12415,12416,12417,12418,12419,12420,12421,12422,12423,12424,12425,12426,12427,12428,12429,12430,12431,12432,12433,12434,12435,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12449,12450,12451,12452,12453,12454,12455,12456,12457,12458,12459,12460,12461,12462,12463,12464,12465,12466,12467,12468,12469,12470,12471,12472,12473,12474,12475,12476,12477,12478,12479,12480,12481,12482,12483,12484,12485,12486,12487,12488,12489,12490,12491,12492,12493,12494,12495,12496,12497,12498,12499,12500,12501,12502,12503,12504,12505,12506,12507,12508,12509,12510,12511,12512,12513,12514,12515,12516,12517,12518,12519,12520,12521,12522,12523,12524,12525,12526,12527,12528,12529,12530,12531,12532,12533,12534,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,931,932,933,934,935,936,937,0,0,0,0,0,0,0,0,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,963,964,965,966,967,968,969,0,0,0,0,0,0,0,65077,65078,65081,65082,65087,65088,65085,65086,65089,65090,65091,65092,0,0,65083,65084,65079,65080,65073,0,65075,65076,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1040,1041,1042,1043,1044,1045,1025,1046,1047,1048,1049,1050,1051,1052,1053,1054,1055,1056,1057,1058,1059,1060,1061,1062,1063,1064,1065,1066,1067,1068,1069,1070,1071,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1072,1073,1074,1075,1076,1077,1105,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1091,1092,1093,1094,1095,1096,1097,1098,1099,1100,1101,1102,1103,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,714,715,729,8211,8213,8229,8245,8453,8457,8598,8599,8600,8601,8725,8735,8739,8786,8806,8807,8895,9552,9553,9554,9555,9556,9557,9558,9559,9560,9561,9562,9563,9564,9565,9566,9567,9568,9569,9570,9571,9572,9573,9574,9575,9576,9577,9578,9579,9580,9581,9582,9583,9584,9585,9586,9587,9601,9602,9603,9604,9605,9606,9607,0,9608,9609,9610,9611,9612,9613,9614,9615,9619,9620,9621,9660,9661,9698,9699,9700,9701,9737,8853,12306,12317,12318,0,0,0,0,0,0,0,0,0,0,0,257,225,462,224,275,233,283,232,299,237,464,236,333,243,466,242,363,250,468,249,470,472,474,476,252,234,593,59335,324,328,59336,609,0,0,0,0,12549,12550,12551,12552,12553,12554,12555,12556,12557,12558,12559,12560,12561,12562,12563,12564,12565,12566,12567,12568,12569,12570,12571,12572,12573,12574,12575,12576,12577,12578,12579,12580,12581,12582,12583,12584,12585,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12321,12322,12323,12324,12325,12326,12327,12328,12329,12963,13198,13199,13212,13213,13214,13217,13252,13262,13265,13266,13269,65072,65506,65508,0,8481,12849,0,8208,0,0,0,12540,12443,12444,12541,12542,12294,12445,12446,65097,65098,65099,65100,65101,65102,65103,65104,65105,65106,65108,65109,65110,65111,65113,65114,65115,65116,65117,65118,65119,65120,65121,0,65122,65123,65124,65125,65126,65128,65129,65130,65131,59367,59368,59369,59370,59371,59372,59373,59374,59375,59376,59377,59378,59379,12295,0,0,0,0,0,0,0,0,0,0,0,0,0,9472,9473,9474,9475,9476,9477,9478,9479,9480,9481,9482,9483,9484,9485,9486,9487,9488,9489,9490,9491,9492,9493,9494,9495,9496,9497,9498,9499,9500,9501,9502,9503,9504,9505,9506,9507,9508,9509,9510,9511,9512,9513,9514,9515,9516,9517,9518,9519,9520,9521,9522,9523,9524,9525,9526,9527,9528,9529,9530,9531,9532,9533,9534,9535,9536,9537,9538,9539,9540,9541,9542,9543,9544,9545,9546,9547,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29404,29405,29407,29410,29411,29412,29413,29414,29415,29418,29419,29429,29430,29433,29437,29438,29439,29440,29442,29444,29445,29446,29447,29448,29449,29451,29452,29453,29455,29456,29457,29458,29460,29464,29465,29466,29471,29472,29475,29476,29478,29479,29480,29485,29487,29488,29490,29491,29493,29494,29498,29499,29500,29501,29504,29505,29506,29507,29508,29509,29510,29511,29512,0,29513,29514,29515,29516,29518,29519,29521,29523,29524,29525,29526,29528,29529,29530,29531,29532,29533,29534,29535,29537,29538,29539,29540,29541,29542,29543,29544,29545,29546,29547,29550,29552,29553,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29554,29555,29556,29557,29558,29559,29560,29561,29562,29563,29564,29565,29567,29568,29569,29570,29571,29573,29574,29576,29578,29580,29581,29583,29584,29586,29587,29588,29589,29591,29592,29593,29594,29596,29597,29598,29600,29601,29603,29604,29605,29606,29607,29608,29610,29612,29613,29617,29620,29621,29622,29624,29625,29628,29629,29630,29631,29633,29635,29636,29637,29638,29639,0,29643,29644,29646,29650,29651,29652,29653,29654,29655,29656,29658,29659,29660,29661,29663,29665,29666,29667,29668,29670,29672,29674,29675,29676,29678,29679,29680,29681,29683,29684,29685,29686,29687,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29688,29689,29690,29691,29692,29693,29694,29695,29696,29697,29698,29700,29703,29704,29707,29708,29709,29710,29713,29714,29715,29716,29717,29718,29719,29720,29721,29724,29725,29726,29727,29728,29729,29731,29732,29735,29737,29739,29741,29743,29745,29746,29751,29752,29753,29754,29755,29757,29758,29759,29760,29762,29763,29764,29765,29766,29767,29768,29769,29770,29771,29772,29773,0,29774,29775,29776,29777,29778,29779,29780,29782,29784,29789,29792,29793,29794,29795,29796,29797,29798,29799,29800,29801,29802,29803,29804,29806,29807,29809,29810,29811,29812,29813,29816,29817,29818,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29819,29820,29821,29823,29826,29828,29829,29830,29832,29833,29834,29836,29837,29839,29841,29842,29843,29844,29845,29846,29847,29848,29849,29850,29851,29853,29855,29856,29857,29858,29859,29860,29861,29862,29866,29867,29868,29869,29870,29871,29872,29873,29874,29875,29876,29877,29878,29879,29880,29881,29883,29884,29885,29886,29887,29888,29889,29890,29891,29892,29893,29894,29895,0,29896,29897,29898,29899,29900,29901,29902,29903,29904,29905,29907,29908,29909,29910,29911,29912,29913,29914,29915,29917,29919,29921,29925,29927,29928,29929,29930,29931,29932,29933,29936,29937,29938,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,29939,29941,29944,29945,29946,29947,29948,29949,29950,29952,29953,29954,29955,29957,29958,29959,29960,29961,29962,29963,29964,29966,29968,29970,29972,29973,29974,29975,29979,29981,29982,29984,29985,29986,29987,29988,29990,29991,29994,29998,30004,30006,30009,30012,30013,30015,30017,30018,30019,30020,30022,30023,30025,30026,30029,30032,30033,30034,30035,30037,30038,30039,30040,0,30045,30046,30047,30048,30049,30050,30051,30052,30055,30056,30057,30059,30060,30061,30062,30063,30064,30065,30067,30069,30070,30071,30074,30075,30076,30077,30078,30080,30081,30082,30084,30085,30087,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30088,30089,30090,30092,30093,30094,30096,30099,30101,30104,30107,30108,30110,30114,30118,30119,30120,30121,30122,30125,30134,30135,30138,30139,30143,30144,30145,30150,30155,30156,30158,30159,30160,30161,30163,30167,30169,30170,30172,30173,30175,30176,30177,30181,30185,30188,30189,30190,30191,30194,30195,30197,30198,30199,30200,30202,30203,30205,30206,30210,30212,30214,30215,0,30216,30217,30219,30221,30222,30223,30225,30226,30227,30228,30230,30234,30236,30237,30238,30241,30243,30247,30248,30252,30254,30255,30257,30258,30262,30263,30265,30266,30267,30269,30273,30274,30276,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30277,30278,30279,30280,30281,30282,30283,30286,30287,30288,30289,30290,30291,30293,30295,30296,30297,30298,30299,30301,30303,30304,30305,30306,30308,30309,30310,30311,30312,30313,30314,30316,30317,30318,30320,30321,30322,30323,30324,30325,30326,30327,30329,30330,30332,30335,30336,30337,30339,30341,30345,30346,30348,30349,30351,30352,30354,30356,30357,30359,30360,30362,30363,0,30364,30365,30366,30367,30368,30369,30370,30371,30373,30374,30375,30376,30377,30378,30379,30380,30381,30383,30384,30387,30389,30390,30391,30392,30393,30394,30395,30396,30397,30398,30400,30401,30403,21834,38463,22467,25384,21710,21769,21696,30353,30284,34108,30702,33406,30861,29233,38552,38797,27688,23433,20474,25353,26263,23736,33018,26696,32942,26114,30414,20985,25942,29100,32753,34948,20658,22885,25034,28595,33453,25420,25170,21485,21543,31494,20843,30116,24052,25300,36299,38774,25226,32793,22365,38712,32610,29240,30333,26575,30334,25670,20336,36133,25308,31255,26001,29677,25644,25203,33324,39041,26495,29256,25198,25292,20276,29923,21322,21150,32458,37030,24110,26758,27036,33152,32465,26834,30917,34444,38225,20621,35876,33502,32990,21253,35090,21093,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30404,30407,30409,30411,30412,30419,30421,30425,30426,30428,30429,30430,30432,30433,30434,30435,30436,30438,30439,30440,30441,30442,30443,30444,30445,30448,30451,30453,30454,30455,30458,30459,30461,30463,30464,30466,30467,30469,30470,30474,30476,30478,30479,30480,30481,30482,30483,30484,30485,30486,30487,30488,30491,30492,30493,30494,30497,30499,30500,30501,30503,30506,30507,0,30508,30510,30512,30513,30514,30515,30516,30521,30523,30525,30526,30527,30530,30532,30533,30534,30536,30537,30538,30539,30540,30541,30542,30543,30546,30547,30548,30549,30550,30551,30552,30553,30556,34180,38649,20445,22561,39281,23453,25265,25253,26292,35961,40077,29190,26479,30865,24754,21329,21271,36744,32972,36125,38049,20493,29384,22791,24811,28953,34987,22868,33519,26412,31528,23849,32503,29997,27893,36454,36856,36924,40763,27604,37145,31508,24444,30887,34006,34109,27605,27609,27606,24065,24199,30201,38381,25949,24330,24517,36767,22721,33218,36991,38491,38829,36793,32534,36140,25153,20415,21464,21342,36776,36777,36779,36941,26631,24426,33176,34920,40150,24971,21035,30250,24428,25996,28626,28392,23486,25672,20853,20912,26564,19993,31177,39292,28851,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30557,30558,30559,30560,30564,30567,30569,30570,30573,30574,30575,30576,30577,30578,30579,30580,30581,30582,30583,30584,30586,30587,30588,30593,30594,30595,30598,30599,30600,30601,30602,30603,30607,30608,30611,30612,30613,30614,30615,30616,30617,30618,30619,30620,30621,30622,30625,30627,30628,30630,30632,30635,30637,30638,30639,30641,30642,30644,30646,30647,30648,30649,30650,0,30652,30654,30656,30657,30658,30659,30660,30661,30662,30663,30664,30665,30666,30667,30668,30670,30671,30672,30673,30674,30675,30676,30677,30678,30680,30681,30682,30685,30686,30687,30688,30689,30692,30149,24182,29627,33760,25773,25320,38069,27874,21338,21187,25615,38082,31636,20271,24091,33334,33046,33162,28196,27850,39539,25429,21340,21754,34917,22496,19981,24067,27493,31807,37096,24598,25830,29468,35009,26448,25165,36130,30572,36393,37319,24425,33756,34081,39184,21442,34453,27531,24813,24808,28799,33485,33329,20179,27815,34255,25805,31961,27133,26361,33609,21397,31574,20391,20876,27979,23618,36461,25554,21449,33580,33590,26597,30900,25661,23519,23700,24046,35815,25286,26612,35962,25600,25530,34633,39307,35863,32544,38130,20135,38416,39076,26124,29462,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30694,30696,30698,30703,30704,30705,30706,30708,30709,30711,30713,30714,30715,30716,30723,30724,30725,30726,30727,30728,30730,30731,30734,30735,30736,30739,30741,30745,30747,30750,30752,30753,30754,30756,30760,30762,30763,30766,30767,30769,30770,30771,30773,30774,30781,30783,30785,30786,30787,30788,30790,30792,30793,30794,30795,30797,30799,30801,30803,30804,30808,30809,30810,0,30811,30812,30814,30815,30816,30817,30818,30819,30820,30821,30822,30823,30824,30825,30831,30832,30833,30834,30835,30836,30837,30838,30840,30841,30842,30843,30845,30846,30847,30848,30849,30850,30851,22330,23581,24120,38271,20607,32928,21378,25950,30021,21809,20513,36229,25220,38046,26397,22066,28526,24034,21557,28818,36710,25199,25764,25507,24443,28552,37108,33251,36784,23576,26216,24561,27785,38472,36225,34924,25745,31216,22478,27225,25104,21576,20056,31243,24809,28548,35802,25215,36894,39563,31204,21507,30196,25345,21273,27744,36831,24347,39536,32827,40831,20360,23610,36196,32709,26021,28861,20805,20914,34411,23815,23456,25277,37228,30068,36364,31264,24833,31609,20167,32504,30597,19985,33261,21021,20986,27249,21416,36487,38148,38607,28353,38500,26970,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30852,30853,30854,30856,30858,30859,30863,30864,30866,30868,30869,30870,30873,30877,30878,30880,30882,30884,30886,30888,30889,30890,30891,30892,30893,30894,30895,30901,30902,30903,30904,30906,30907,30908,30909,30911,30912,30914,30915,30916,30918,30919,30920,30924,30925,30926,30927,30929,30930,30931,30934,30935,30936,30938,30939,30940,30941,30942,30943,30944,30945,30946,30947,0,30948,30949,30950,30951,30953,30954,30955,30957,30958,30959,30960,30961,30963,30965,30966,30968,30969,30971,30972,30973,30974,30975,30976,30978,30979,30980,30982,30983,30984,30985,30986,30987,30988,30784,20648,30679,25616,35302,22788,25571,24029,31359,26941,20256,33337,21912,20018,30126,31383,24162,24202,38383,21019,21561,28810,25462,38180,22402,26149,26943,37255,21767,28147,32431,34850,25139,32496,30133,33576,30913,38604,36766,24904,29943,35789,27492,21050,36176,27425,32874,33905,22257,21254,20174,19995,20945,31895,37259,31751,20419,36479,31713,31388,25703,23828,20652,33030,30209,31929,28140,32736,26449,23384,23544,30923,25774,25619,25514,25387,38169,25645,36798,31572,30249,25171,22823,21574,27513,20643,25140,24102,27526,20195,36151,34955,24453,36910,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,30989,30990,30991,30992,30993,30994,30996,30997,30998,30999,31000,31001,31002,31003,31004,31005,31007,31008,31009,31010,31011,31013,31014,31015,31016,31017,31018,31019,31020,31021,31022,31023,31024,31025,31026,31027,31029,31030,31031,31032,31033,31037,31039,31042,31043,31044,31045,31047,31050,31051,31052,31053,31054,31055,31056,31057,31058,31060,31061,31064,31065,31073,31075,0,31076,31078,31081,31082,31083,31084,31086,31088,31089,31090,31091,31092,31093,31094,31097,31099,31100,31101,31102,31103,31106,31107,31110,31111,31112,31113,31115,31116,31117,31118,31120,31121,31122,24608,32829,25285,20025,21333,37112,25528,32966,26086,27694,20294,24814,28129,35806,24377,34507,24403,25377,20826,33633,26723,20992,25443,36424,20498,23707,31095,23548,21040,31291,24764,36947,30423,24503,24471,30340,36460,28783,30331,31561,30634,20979,37011,22564,20302,28404,36842,25932,31515,29380,28068,32735,23265,25269,24213,22320,33922,31532,24093,24351,36882,32532,39072,25474,28359,30872,28857,20856,38747,22443,30005,20291,30008,24215,24806,22880,28096,27583,30857,21500,38613,20939,20993,25481,21514,38035,35843,36300,29241,30879,34678,36845,35853,21472,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31123,31124,31125,31126,31127,31128,31129,31131,31132,31133,31134,31135,31136,31137,31138,31139,31140,31141,31142,31144,31145,31146,31147,31148,31149,31150,31151,31152,31153,31154,31156,31157,31158,31159,31160,31164,31167,31170,31172,31173,31175,31176,31178,31180,31182,31183,31184,31187,31188,31190,31191,31193,31194,31195,31196,31197,31198,31200,31201,31202,31205,31208,31210,0,31212,31214,31217,31218,31219,31220,31221,31222,31223,31225,31226,31228,31230,31231,31233,31236,31237,31239,31240,31241,31242,31244,31247,31248,31249,31250,31251,31253,31254,31256,31257,31259,31260,19969,30447,21486,38025,39030,40718,38189,23450,35746,20002,19996,20908,33891,25026,21160,26635,20375,24683,20923,27934,20828,25238,26007,38497,35910,36887,30168,37117,30563,27602,29322,29420,35835,22581,30585,36172,26460,38208,32922,24230,28193,22930,31471,30701,38203,27573,26029,32526,22534,20817,38431,23545,22697,21544,36466,25958,39039,22244,38045,30462,36929,25479,21702,22810,22842,22427,36530,26421,36346,33333,21057,24816,22549,34558,23784,40517,20420,39069,35769,23077,24694,21380,25212,36943,37122,39295,24681,32780,20799,32819,23572,39285,27953,20108,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31261,31263,31265,31266,31268,31269,31270,31271,31272,31273,31274,31275,31276,31277,31278,31279,31280,31281,31282,31284,31285,31286,31288,31290,31294,31296,31297,31298,31299,31300,31301,31303,31304,31305,31306,31307,31308,31309,31310,31311,31312,31314,31315,31316,31317,31318,31320,31321,31322,31323,31324,31325,31326,31327,31328,31329,31330,31331,31332,31333,31334,31335,31336,0,31337,31338,31339,31340,31341,31342,31343,31345,31346,31347,31349,31355,31356,31357,31358,31362,31365,31367,31369,31370,31371,31372,31374,31375,31376,31379,31380,31385,31386,31387,31390,31393,31394,36144,21457,32602,31567,20240,20047,38400,27861,29648,34281,24070,30058,32763,27146,30718,38034,32321,20961,28902,21453,36820,33539,36137,29359,39277,27867,22346,33459,26041,32938,25151,38450,22952,20223,35775,32442,25918,33778,38750,21857,39134,32933,21290,35837,21536,32954,24223,27832,36153,33452,37210,21545,27675,20998,32439,22367,28954,27774,31881,22859,20221,24575,24868,31914,20016,23553,26539,34562,23792,38155,39118,30127,28925,36898,20911,32541,35773,22857,20964,20315,21542,22827,25975,32932,23413,25206,25282,36752,24133,27679,31526,20239,20440,26381,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31395,31396,31399,31401,31402,31403,31406,31407,31408,31409,31410,31412,31413,31414,31415,31416,31417,31418,31419,31420,31421,31422,31424,31425,31426,31427,31428,31429,31430,31431,31432,31433,31434,31436,31437,31438,31439,31440,31441,31442,31443,31444,31445,31447,31448,31450,31451,31452,31453,31457,31458,31460,31463,31464,31465,31466,31467,31468,31470,31472,31473,31474,31475,0,31476,31477,31478,31479,31480,31483,31484,31486,31488,31489,31490,31493,31495,31497,31500,31501,31502,31504,31506,31507,31510,31511,31512,31514,31516,31517,31519,31521,31522,31523,31527,31529,31533,28014,28074,31119,34993,24343,29995,25242,36741,20463,37340,26023,33071,33105,24220,33104,36212,21103,35206,36171,22797,20613,20184,38428,29238,33145,36127,23500,35747,38468,22919,32538,21648,22134,22030,35813,25913,27010,38041,30422,28297,24178,29976,26438,26577,31487,32925,36214,24863,31174,25954,36195,20872,21018,38050,32568,32923,32434,23703,28207,26464,31705,30347,39640,33167,32660,31957,25630,38224,31295,21578,21733,27468,25601,25096,40509,33011,30105,21106,38761,33883,26684,34532,38401,38548,38124,20010,21508,32473,26681,36319,32789,26356,24218,32697,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31535,31536,31538,31540,31541,31542,31543,31545,31547,31549,31551,31552,31553,31554,31555,31556,31558,31560,31562,31565,31566,31571,31573,31575,31577,31580,31582,31583,31585,31587,31588,31589,31590,31591,31592,31593,31594,31595,31596,31597,31599,31600,31603,31604,31606,31608,31610,31612,31613,31615,31617,31618,31619,31620,31622,31623,31624,31625,31626,31627,31628,31630,31631,0,31633,31634,31635,31638,31640,31641,31642,31643,31646,31647,31648,31651,31652,31653,31662,31663,31664,31666,31667,31669,31670,31671,31673,31674,31675,31676,31677,31678,31679,31680,31682,31683,31684,22466,32831,26775,24037,25915,21151,24685,40858,20379,36524,20844,23467,24339,24041,27742,25329,36129,20849,38057,21246,27807,33503,29399,22434,26500,36141,22815,36764,33735,21653,31629,20272,27837,23396,22993,40723,21476,34506,39592,35895,32929,25925,39038,22266,38599,21038,29916,21072,23521,25346,35074,20054,25296,24618,26874,20851,23448,20896,35266,31649,39302,32592,24815,28748,36143,20809,24191,36891,29808,35268,22317,30789,24402,40863,38394,36712,39740,35809,30328,26690,26588,36330,36149,21053,36746,28378,26829,38149,37101,22269,26524,35065,36807,21704,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31685,31688,31689,31690,31691,31693,31694,31695,31696,31698,31700,31701,31702,31703,31704,31707,31708,31710,31711,31712,31714,31715,31716,31719,31720,31721,31723,31724,31725,31727,31728,31730,31731,31732,31733,31734,31736,31737,31738,31739,31741,31743,31744,31745,31746,31747,31748,31749,31750,31752,31753,31754,31757,31758,31760,31761,31762,31763,31764,31765,31767,31768,31769,0,31770,31771,31772,31773,31774,31776,31777,31778,31779,31780,31781,31784,31785,31787,31788,31789,31790,31791,31792,31793,31794,31795,31796,31797,31798,31799,31801,31802,31803,31804,31805,31806,31810,39608,23401,28023,27686,20133,23475,39559,37219,25000,37039,38889,21547,28085,23506,20989,21898,32597,32752,25788,25421,26097,25022,24717,28938,27735,27721,22831,26477,33322,22741,22158,35946,27627,37085,22909,32791,21495,28009,21621,21917,33655,33743,26680,31166,21644,20309,21512,30418,35977,38402,27827,28088,36203,35088,40548,36154,22079,40657,30165,24456,29408,24680,21756,20136,27178,34913,24658,36720,21700,28888,34425,40511,27946,23439,24344,32418,21897,20399,29492,21564,21402,20505,21518,21628,20046,24573,29786,22774,33899,32993,34676,29392,31946,28246,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31811,31812,31813,31814,31815,31816,31817,31818,31819,31820,31822,31823,31824,31825,31826,31827,31828,31829,31830,31831,31832,31833,31834,31835,31836,31837,31838,31839,31840,31841,31842,31843,31844,31845,31846,31847,31848,31849,31850,31851,31852,31853,31854,31855,31856,31857,31858,31861,31862,31863,31864,31865,31866,31870,31871,31872,31873,31874,31875,31876,31877,31878,31879,0,31880,31882,31883,31884,31885,31886,31887,31888,31891,31892,31894,31897,31898,31899,31904,31905,31907,31910,31911,31912,31913,31915,31916,31917,31919,31920,31924,31925,31926,31927,31928,31930,31931,24359,34382,21804,25252,20114,27818,25143,33457,21719,21326,29502,28369,30011,21010,21270,35805,27088,24458,24576,28142,22351,27426,29615,26707,36824,32531,25442,24739,21796,30186,35938,28949,28067,23462,24187,33618,24908,40644,30970,34647,31783,30343,20976,24822,29004,26179,24140,24653,35854,28784,25381,36745,24509,24674,34516,22238,27585,24724,24935,21321,24800,26214,36159,31229,20250,28905,27719,35763,35826,32472,33636,26127,23130,39746,27985,28151,35905,27963,20249,28779,33719,25110,24785,38669,36135,31096,20987,22334,22522,26426,30072,31293,31215,31637,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31935,31936,31938,31939,31940,31942,31945,31947,31950,31951,31952,31953,31954,31955,31956,31960,31962,31963,31965,31966,31969,31970,31971,31972,31973,31974,31975,31977,31978,31979,31980,31981,31982,31984,31985,31986,31987,31988,31989,31990,31991,31993,31994,31996,31997,31998,31999,32000,32001,32002,32003,32004,32005,32006,32007,32008,32009,32011,32012,32013,32014,32015,32016,0,32017,32018,32019,32020,32021,32022,32023,32024,32025,32026,32027,32028,32029,32030,32031,32033,32035,32036,32037,32038,32040,32041,32042,32044,32045,32046,32048,32049,32050,32051,32052,32053,32054,32908,39269,36857,28608,35749,40481,23020,32489,32521,21513,26497,26840,36753,31821,38598,21450,24613,30142,27762,21363,23241,32423,25380,20960,33034,24049,34015,25216,20864,23395,20238,31085,21058,24760,27982,23492,23490,35745,35760,26082,24524,38469,22931,32487,32426,22025,26551,22841,20339,23478,21152,33626,39050,36158,30002,38078,20551,31292,20215,26550,39550,23233,27516,30417,22362,23574,31546,38388,29006,20860,32937,33392,22904,32516,33575,26816,26604,30897,30839,25315,25441,31616,20461,21098,20943,33616,27099,37492,36341,36145,35265,38190,31661,20214,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32055,32056,32057,32058,32059,32060,32061,32062,32063,32064,32065,32066,32067,32068,32069,32070,32071,32072,32073,32074,32075,32076,32077,32078,32079,32080,32081,32082,32083,32084,32085,32086,32087,32088,32089,32090,32091,32092,32093,32094,32095,32096,32097,32098,32099,32100,32101,32102,32103,32104,32105,32106,32107,32108,32109,32111,32112,32113,32114,32115,32116,32117,32118,0,32120,32121,32122,32123,32124,32125,32126,32127,32128,32129,32130,32131,32132,32133,32134,32135,32136,32137,32138,32139,32140,32141,32142,32143,32144,32145,32146,32147,32148,32149,32150,32151,32152,20581,33328,21073,39279,28176,28293,28071,24314,20725,23004,23558,27974,27743,30086,33931,26728,22870,35762,21280,37233,38477,34121,26898,30977,28966,33014,20132,37066,27975,39556,23047,22204,25605,38128,30699,20389,33050,29409,35282,39290,32564,32478,21119,25945,37237,36735,36739,21483,31382,25581,25509,30342,31224,34903,38454,25130,21163,33410,26708,26480,25463,30571,31469,27905,32467,35299,22992,25106,34249,33445,30028,20511,20171,30117,35819,23626,24062,31563,26020,37329,20170,27941,35167,32039,38182,20165,35880,36827,38771,26187,31105,36817,28908,28024,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32153,32154,32155,32156,32157,32158,32159,32160,32161,32162,32163,32164,32165,32167,32168,32169,32170,32171,32172,32173,32175,32176,32177,32178,32179,32180,32181,32182,32183,32184,32185,32186,32187,32188,32189,32190,32191,32192,32193,32194,32195,32196,32197,32198,32199,32200,32201,32202,32203,32204,32205,32206,32207,32208,32209,32210,32211,32212,32213,32214,32215,32216,32217,0,32218,32219,32220,32221,32222,32223,32224,32225,32226,32227,32228,32229,32230,32231,32232,32233,32234,32235,32236,32237,32238,32239,32240,32241,32242,32243,32244,32245,32246,32247,32248,32249,32250,23613,21170,33606,20834,33550,30555,26230,40120,20140,24778,31934,31923,32463,20117,35686,26223,39048,38745,22659,25964,38236,24452,30153,38742,31455,31454,20928,28847,31384,25578,31350,32416,29590,38893,20037,28792,20061,37202,21417,25937,26087,33276,33285,21646,23601,30106,38816,25304,29401,30141,23621,39545,33738,23616,21632,30697,20030,27822,32858,25298,25454,24040,20855,36317,36382,38191,20465,21477,24807,28844,21095,25424,40515,23071,20518,30519,21367,32482,25733,25899,25225,25496,20500,29237,35273,20915,35776,32477,22343,33740,38055,20891,21531,23803,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32251,32252,32253,32254,32255,32256,32257,32258,32259,32260,32261,32262,32263,32264,32265,32266,32267,32268,32269,32270,32271,32272,32273,32274,32275,32276,32277,32278,32279,32280,32281,32282,32283,32284,32285,32286,32287,32288,32289,32290,32291,32292,32293,32294,32295,32296,32297,32298,32299,32300,32301,32302,32303,32304,32305,32306,32307,32308,32309,32310,32311,32312,32313,0,32314,32316,32317,32318,32319,32320,32322,32323,32324,32325,32326,32328,32329,32330,32331,32332,32333,32334,32335,32336,32337,32338,32339,32340,32341,32342,32343,32344,32345,32346,32347,32348,32349,20426,31459,27994,37089,39567,21888,21654,21345,21679,24320,25577,26999,20975,24936,21002,22570,21208,22350,30733,30475,24247,24951,31968,25179,25239,20130,28821,32771,25335,28900,38752,22391,33499,26607,26869,30933,39063,31185,22771,21683,21487,28212,20811,21051,23458,35838,32943,21827,22438,24691,22353,21549,31354,24656,23380,25511,25248,21475,25187,23495,26543,21741,31391,33510,37239,24211,35044,22840,22446,25358,36328,33007,22359,31607,20393,24555,23485,27454,21281,31568,29378,26694,30719,30518,26103,20917,20111,30420,23743,31397,33909,22862,39745,20608,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32350,32351,32352,32353,32354,32355,32356,32357,32358,32359,32360,32361,32362,32363,32364,32365,32366,32367,32368,32369,32370,32371,32372,32373,32374,32375,32376,32377,32378,32379,32380,32381,32382,32383,32384,32385,32387,32388,32389,32390,32391,32392,32393,32394,32395,32396,32397,32398,32399,32400,32401,32402,32403,32404,32405,32406,32407,32408,32409,32410,32412,32413,32414,0,32430,32436,32443,32444,32470,32484,32492,32505,32522,32528,32542,32567,32569,32571,32572,32573,32574,32575,32576,32577,32579,32582,32583,32584,32585,32586,32587,32588,32589,32590,32591,32594,32595,39304,24871,28291,22372,26118,25414,22256,25324,25193,24275,38420,22403,25289,21895,34593,33098,36771,21862,33713,26469,36182,34013,23146,26639,25318,31726,38417,20848,28572,35888,25597,35272,25042,32518,28866,28389,29701,27028,29436,24266,37070,26391,28010,25438,21171,29282,32769,20332,23013,37226,28889,28061,21202,20048,38647,38253,34174,30922,32047,20769,22418,25794,32907,31867,27882,26865,26974,20919,21400,26792,29313,40654,31729,29432,31163,28435,29702,26446,37324,40100,31036,33673,33620,21519,26647,20029,21385,21169,30782,21382,21033,20616,20363,20432,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32598,32601,32603,32604,32605,32606,32608,32611,32612,32613,32614,32615,32619,32620,32621,32623,32624,32627,32629,32630,32631,32632,32634,32635,32636,32637,32639,32640,32642,32643,32644,32645,32646,32647,32648,32649,32651,32653,32655,32656,32657,32658,32659,32661,32662,32663,32664,32665,32667,32668,32672,32674,32675,32677,32678,32680,32681,32682,32683,32684,32685,32686,32689,0,32691,32692,32693,32694,32695,32698,32699,32702,32704,32706,32707,32708,32710,32711,32712,32713,32715,32717,32719,32720,32721,32722,32723,32726,32727,32729,32730,32731,32732,32733,32734,32738,32739,30178,31435,31890,27813,38582,21147,29827,21737,20457,32852,33714,36830,38256,24265,24604,28063,24088,25947,33080,38142,24651,28860,32451,31918,20937,26753,31921,33391,20004,36742,37327,26238,20142,35845,25769,32842,20698,30103,29134,23525,36797,28518,20102,25730,38243,24278,26009,21015,35010,28872,21155,29454,29747,26519,30967,38678,20020,37051,40158,28107,20955,36161,21533,25294,29618,33777,38646,40836,38083,20278,32666,20940,28789,38517,23725,39046,21478,20196,28316,29705,27060,30827,39311,30041,21016,30244,27969,26611,20845,40857,32843,21657,31548,31423,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32740,32743,32744,32746,32747,32748,32749,32751,32754,32756,32757,32758,32759,32760,32761,32762,32765,32766,32767,32770,32775,32776,32777,32778,32782,32783,32785,32787,32794,32795,32797,32798,32799,32801,32803,32804,32811,32812,32813,32814,32815,32816,32818,32820,32825,32826,32828,32830,32832,32833,32836,32837,32839,32840,32841,32846,32847,32848,32849,32851,32853,32854,32855,0,32857,32859,32860,32861,32862,32863,32864,32865,32866,32867,32868,32869,32870,32871,32872,32875,32876,32877,32878,32879,32880,32882,32883,32884,32885,32886,32887,32888,32889,32890,32891,32892,32893,38534,22404,25314,38471,27004,23044,25602,31699,28431,38475,33446,21346,39045,24208,28809,25523,21348,34383,40065,40595,30860,38706,36335,36162,40575,28510,31108,24405,38470,25134,39540,21525,38109,20387,26053,23653,23649,32533,34385,27695,24459,29575,28388,32511,23782,25371,23402,28390,21365,20081,25504,30053,25249,36718,20262,20177,27814,32438,35770,33821,34746,32599,36923,38179,31657,39585,35064,33853,27931,39558,32476,22920,40635,29595,30721,34434,39532,39554,22043,21527,22475,20080,40614,21334,36808,33033,30610,39314,34542,28385,34067,26364,24930,28459,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32894,32897,32898,32901,32904,32906,32909,32910,32911,32912,32913,32914,32916,32917,32919,32921,32926,32931,32934,32935,32936,32940,32944,32947,32949,32950,32952,32953,32955,32965,32967,32968,32969,32970,32971,32975,32976,32977,32978,32979,32980,32981,32984,32991,32992,32994,32995,32998,33006,33013,33015,33017,33019,33022,33023,33024,33025,33027,33028,33029,33031,33032,33035,0,33036,33045,33047,33049,33051,33052,33053,33055,33056,33057,33058,33059,33060,33061,33062,33063,33064,33065,33066,33067,33069,33070,33072,33075,33076,33077,33079,33081,33082,33083,33084,33085,33087,35881,33426,33579,30450,27667,24537,33725,29483,33541,38170,27611,30683,38086,21359,33538,20882,24125,35980,36152,20040,29611,26522,26757,37238,38665,29028,27809,30473,23186,38209,27599,32654,26151,23504,22969,23194,38376,38391,20204,33804,33945,27308,30431,38192,29467,26790,23391,30511,37274,38753,31964,36855,35868,24357,31859,31192,35269,27852,34588,23494,24130,26825,30496,32501,20885,20813,21193,23081,32517,38754,33495,25551,30596,34256,31186,28218,24217,22937,34065,28781,27665,25279,30399,25935,24751,38397,26126,34719,40483,38125,21517,21629,35884,25720,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33088,33089,33090,33091,33092,33093,33095,33097,33101,33102,33103,33106,33110,33111,33112,33115,33116,33117,33118,33119,33121,33122,33123,33124,33126,33128,33130,33131,33132,33135,33138,33139,33141,33142,33143,33144,33153,33155,33156,33157,33158,33159,33161,33163,33164,33165,33166,33168,33170,33171,33172,33173,33174,33175,33177,33178,33182,33183,33184,33185,33186,33188,33189,0,33191,33193,33195,33196,33197,33198,33199,33200,33201,33202,33204,33205,33206,33207,33208,33209,33212,33213,33214,33215,33220,33221,33223,33224,33225,33227,33229,33230,33231,33232,33233,33234,33235,25721,34321,27169,33180,30952,25705,39764,25273,26411,33707,22696,40664,27819,28448,23518,38476,35851,29279,26576,25287,29281,20137,22982,27597,22675,26286,24149,21215,24917,26408,30446,30566,29287,31302,25343,21738,21584,38048,37027,23068,32435,27670,20035,22902,32784,22856,21335,30007,38590,22218,25376,33041,24700,38393,28118,21602,39297,20869,23273,33021,22958,38675,20522,27877,23612,25311,20320,21311,33147,36870,28346,34091,25288,24180,30910,25781,25467,24565,23064,37247,40479,23615,25423,32834,23421,21870,38218,38221,28037,24744,26592,29406,20957,23425,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33236,33237,33238,33239,33240,33241,33242,33243,33244,33245,33246,33247,33248,33249,33250,33252,33253,33254,33256,33257,33259,33262,33263,33264,33265,33266,33269,33270,33271,33272,33273,33274,33277,33279,33283,33287,33288,33289,33290,33291,33294,33295,33297,33299,33301,33302,33303,33304,33305,33306,33309,33312,33316,33317,33318,33319,33321,33326,33330,33338,33340,33341,33343,0,33344,33345,33346,33347,33349,33350,33352,33354,33356,33357,33358,33360,33361,33362,33363,33364,33365,33366,33367,33369,33371,33372,33373,33374,33376,33377,33378,33379,33380,33381,33382,33383,33385,25319,27870,29275,25197,38062,32445,33043,27987,20892,24324,22900,21162,24594,22899,26262,34384,30111,25386,25062,31983,35834,21734,27431,40485,27572,34261,21589,20598,27812,21866,36276,29228,24085,24597,29750,25293,25490,29260,24472,28227,27966,25856,28504,30424,30928,30460,30036,21028,21467,20051,24222,26049,32810,32982,25243,21638,21032,28846,34957,36305,27873,21624,32986,22521,35060,36180,38506,37197,20329,27803,21943,30406,30768,25256,28921,28558,24429,34028,26842,30844,31735,33192,26379,40527,25447,30896,22383,30738,38713,25209,25259,21128,29749,27607,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33386,33387,33388,33389,33393,33397,33398,33399,33400,33403,33404,33408,33409,33411,33413,33414,33415,33417,33420,33424,33427,33428,33429,33430,33434,33435,33438,33440,33442,33443,33447,33458,33461,33462,33466,33467,33468,33471,33472,33474,33475,33477,33478,33481,33488,33494,33497,33498,33501,33506,33511,33512,33513,33514,33516,33517,33518,33520,33522,33523,33525,33526,33528,0,33530,33532,33533,33534,33535,33536,33546,33547,33549,33552,33554,33555,33558,33560,33561,33565,33566,33567,33568,33569,33570,33571,33572,33573,33574,33577,33578,33582,33584,33586,33591,33595,33597,21860,33086,30130,30382,21305,30174,20731,23617,35692,31687,20559,29255,39575,39128,28418,29922,31080,25735,30629,25340,39057,36139,21697,32856,20050,22378,33529,33805,24179,20973,29942,35780,23631,22369,27900,39047,23110,30772,39748,36843,31893,21078,25169,38138,20166,33670,33889,33769,33970,22484,26420,22275,26222,28006,35889,26333,28689,26399,27450,26646,25114,22971,19971,20932,28422,26578,27791,20854,26827,22855,27495,30054,23822,33040,40784,26071,31048,31041,39569,36215,23682,20062,20225,21551,22865,30732,22120,27668,36804,24323,27773,27875,35755,25488,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33598,33599,33601,33602,33604,33605,33608,33610,33611,33612,33613,33614,33619,33621,33622,33623,33624,33625,33629,33634,33648,33649,33650,33651,33652,33653,33654,33657,33658,33662,33663,33664,33665,33666,33667,33668,33671,33672,33674,33675,33676,33677,33679,33680,33681,33684,33685,33686,33687,33689,33690,33693,33695,33697,33698,33699,33700,33701,33702,33703,33708,33709,33710,0,33711,33717,33723,33726,33727,33730,33731,33732,33734,33736,33737,33739,33741,33742,33744,33745,33746,33747,33749,33751,33753,33754,33755,33758,33762,33763,33764,33766,33767,33768,33771,33772,33773,24688,27965,29301,25190,38030,38085,21315,36801,31614,20191,35878,20094,40660,38065,38067,21069,28508,36963,27973,35892,22545,23884,27424,27465,26538,21595,33108,32652,22681,34103,24378,25250,27207,38201,25970,24708,26725,30631,20052,20392,24039,38808,25772,32728,23789,20431,31373,20999,33540,19988,24623,31363,38054,20405,20146,31206,29748,21220,33465,25810,31165,23517,27777,38738,36731,27682,20542,21375,28165,25806,26228,27696,24773,39031,35831,24198,29756,31351,31179,19992,37041,29699,27714,22234,37195,27845,36235,21306,34502,26354,36527,23624,39537,28192,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33774,33775,33779,33780,33781,33782,33783,33786,33787,33788,33790,33791,33792,33794,33797,33799,33800,33801,33802,33808,33810,33811,33812,33813,33814,33815,33817,33818,33819,33822,33823,33824,33825,33826,33827,33833,33834,33835,33836,33837,33838,33839,33840,33842,33843,33844,33845,33846,33847,33849,33850,33851,33854,33855,33856,33857,33858,33859,33860,33861,33863,33864,33865,0,33866,33867,33868,33869,33870,33871,33872,33874,33875,33876,33877,33878,33880,33885,33886,33887,33888,33890,33892,33893,33894,33895,33896,33898,33902,33903,33904,33906,33908,33911,33913,33915,33916,21462,23094,40843,36259,21435,22280,39079,26435,37275,27849,20840,30154,25331,29356,21048,21149,32570,28820,30264,21364,40522,27063,30830,38592,35033,32676,28982,29123,20873,26579,29924,22756,25880,22199,35753,39286,25200,32469,24825,28909,22764,20161,20154,24525,38887,20219,35748,20995,22922,32427,25172,20173,26085,25102,33592,33993,33635,34701,29076,28342,23481,32466,20887,25545,26580,32905,33593,34837,20754,23418,22914,36785,20083,27741,20837,35109,36719,38446,34122,29790,38160,38384,28070,33509,24369,25746,27922,33832,33134,40131,22622,36187,19977,21441,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,33917,33918,33919,33920,33921,33923,33924,33925,33926,33930,33933,33935,33936,33937,33938,33939,33940,33941,33942,33944,33946,33947,33949,33950,33951,33952,33954,33955,33956,33957,33958,33959,33960,33961,33962,33963,33964,33965,33966,33968,33969,33971,33973,33974,33975,33979,33980,33982,33984,33986,33987,33989,33990,33991,33992,33995,33996,33998,33999,34002,34004,34005,34007,0,34008,34009,34010,34011,34012,34014,34017,34018,34020,34023,34024,34025,34026,34027,34029,34030,34031,34033,34034,34035,34036,34037,34038,34039,34040,34041,34042,34043,34045,34046,34048,34049,34050,20254,25955,26705,21971,20007,25620,39578,25195,23234,29791,33394,28073,26862,20711,33678,30722,26432,21049,27801,32433,20667,21861,29022,31579,26194,29642,33515,26441,23665,21024,29053,34923,38378,38485,25797,36193,33203,21892,27733,25159,32558,22674,20260,21830,36175,26188,19978,23578,35059,26786,25422,31245,28903,33421,21242,38902,23569,21736,37045,32461,22882,36170,34503,33292,33293,36198,25668,23556,24913,28041,31038,35774,30775,30003,21627,20280,36523,28145,23072,32453,31070,27784,23457,23158,29978,32958,24910,28183,22768,29983,29989,29298,21319,32499,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34051,34052,34053,34054,34055,34056,34057,34058,34059,34061,34062,34063,34064,34066,34068,34069,34070,34072,34073,34075,34076,34077,34078,34080,34082,34083,34084,34085,34086,34087,34088,34089,34090,34093,34094,34095,34096,34097,34098,34099,34100,34101,34102,34110,34111,34112,34113,34114,34116,34117,34118,34119,34123,34124,34125,34126,34127,34128,34129,34130,34131,34132,34133,0,34135,34136,34138,34139,34140,34141,34143,34144,34145,34146,34147,34149,34150,34151,34153,34154,34155,34156,34157,34158,34159,34160,34161,34163,34165,34166,34167,34168,34172,34173,34175,34176,34177,30465,30427,21097,32988,22307,24072,22833,29422,26045,28287,35799,23608,34417,21313,30707,25342,26102,20160,39135,34432,23454,35782,21490,30690,20351,23630,39542,22987,24335,31034,22763,19990,26623,20107,25325,35475,36893,21183,26159,21980,22124,36866,20181,20365,37322,39280,27663,24066,24643,23460,35270,35797,25910,25163,39318,23432,23551,25480,21806,21463,30246,20861,34092,26530,26803,27530,25234,36755,21460,33298,28113,30095,20070,36174,23408,29087,34223,26257,26329,32626,34560,40653,40736,23646,26415,36848,26641,26463,25101,31446,22661,24246,25968,28465,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34178,34179,34182,34184,34185,34186,34187,34188,34189,34190,34192,34193,34194,34195,34196,34197,34198,34199,34200,34201,34202,34205,34206,34207,34208,34209,34210,34211,34213,34214,34215,34217,34219,34220,34221,34225,34226,34227,34228,34229,34230,34232,34234,34235,34236,34237,34238,34239,34240,34242,34243,34244,34245,34246,34247,34248,34250,34251,34252,34253,34254,34257,34258,0,34260,34262,34263,34264,34265,34266,34267,34269,34270,34271,34272,34273,34274,34275,34277,34278,34279,34280,34282,34283,34284,34285,34286,34287,34288,34289,34290,34291,34292,34293,34294,34295,34296,24661,21047,32781,25684,34928,29993,24069,26643,25332,38684,21452,29245,35841,27700,30561,31246,21550,30636,39034,33308,35828,30805,26388,28865,26031,25749,22070,24605,31169,21496,19997,27515,32902,23546,21987,22235,20282,20284,39282,24051,26494,32824,24578,39042,36865,23435,35772,35829,25628,33368,25822,22013,33487,37221,20439,32032,36895,31903,20723,22609,28335,23487,35785,32899,37240,33948,31639,34429,38539,38543,32485,39635,30862,23681,31319,36930,38567,31071,23385,25439,31499,34001,26797,21766,32553,29712,32034,38145,25152,22604,20182,23427,22905,22612,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34297,34298,34300,34301,34302,34304,34305,34306,34307,34308,34310,34311,34312,34313,34314,34315,34316,34317,34318,34319,34320,34322,34323,34324,34325,34327,34328,34329,34330,34331,34332,34333,34334,34335,34336,34337,34338,34339,34340,34341,34342,34344,34346,34347,34348,34349,34350,34351,34352,34353,34354,34355,34356,34357,34358,34359,34361,34362,34363,34365,34366,34367,34368,0,34369,34370,34371,34372,34373,34374,34375,34376,34377,34378,34379,34380,34386,34387,34389,34390,34391,34392,34393,34395,34396,34397,34399,34400,34401,34403,34404,34405,34406,34407,34408,34409,34410,29549,25374,36427,36367,32974,33492,25260,21488,27888,37214,22826,24577,27760,22349,25674,36138,30251,28393,22363,27264,30192,28525,35885,35848,22374,27631,34962,30899,25506,21497,28845,27748,22616,25642,22530,26848,33179,21776,31958,20504,36538,28108,36255,28907,25487,28059,28372,32486,33796,26691,36867,28120,38518,35752,22871,29305,34276,33150,30140,35466,26799,21076,36386,38161,25552,39064,36420,21884,20307,26367,22159,24789,28053,21059,23625,22825,28155,22635,30000,29980,24684,33300,33094,25361,26465,36834,30522,36339,36148,38081,24086,21381,21548,28867,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34413,34415,34416,34418,34419,34420,34421,34422,34423,34424,34435,34436,34437,34438,34439,34440,34441,34446,34447,34448,34449,34450,34452,34454,34455,34456,34457,34458,34459,34462,34463,34464,34465,34466,34469,34470,34475,34477,34478,34482,34483,34487,34488,34489,34491,34492,34493,34494,34495,34497,34498,34499,34501,34504,34508,34509,34514,34515,34517,34518,34519,34522,34524,0,34525,34528,34529,34530,34531,34533,34534,34535,34536,34538,34539,34540,34543,34549,34550,34551,34554,34555,34556,34557,34559,34561,34564,34565,34566,34571,34572,34574,34575,34576,34577,34580,34582,27712,24311,20572,20141,24237,25402,33351,36890,26704,37230,30643,21516,38108,24420,31461,26742,25413,31570,32479,30171,20599,25237,22836,36879,20984,31171,31361,22270,24466,36884,28034,23648,22303,21520,20820,28237,22242,25512,39059,33151,34581,35114,36864,21534,23663,33216,25302,25176,33073,40501,38464,39534,39548,26925,22949,25299,21822,25366,21703,34521,27964,23043,29926,34972,27498,22806,35916,24367,28286,29609,39037,20024,28919,23436,30871,25405,26202,30358,24779,23451,23113,19975,33109,27754,29579,20129,26505,32593,24448,26106,26395,24536,22916,23041,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34585,34587,34589,34591,34592,34596,34598,34599,34600,34602,34603,34604,34605,34607,34608,34610,34611,34613,34614,34616,34617,34618,34620,34621,34624,34625,34626,34627,34628,34629,34630,34634,34635,34637,34639,34640,34641,34642,34644,34645,34646,34648,34650,34651,34652,34653,34654,34655,34657,34658,34662,34663,34664,34665,34666,34667,34668,34669,34671,34673,34674,34675,34677,0,34679,34680,34681,34682,34687,34688,34689,34692,34694,34695,34697,34698,34700,34702,34703,34704,34705,34706,34708,34709,34710,34712,34713,34714,34715,34716,34717,34718,34720,34721,34722,34723,34724,24013,24494,21361,38886,36829,26693,22260,21807,24799,20026,28493,32500,33479,33806,22996,20255,20266,23614,32428,26410,34074,21619,30031,32963,21890,39759,20301,28205,35859,23561,24944,21355,30239,28201,34442,25991,38395,32441,21563,31283,32010,38382,21985,32705,29934,25373,34583,28065,31389,25105,26017,21351,25569,27779,24043,21596,38056,20044,27745,35820,23627,26080,33436,26791,21566,21556,27595,27494,20116,25410,21320,33310,20237,20398,22366,25098,38654,26212,29289,21247,21153,24735,35823,26132,29081,26512,35199,30802,30717,26224,22075,21560,38177,29306,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34725,34726,34727,34729,34730,34734,34736,34737,34738,34740,34742,34743,34744,34745,34747,34748,34750,34751,34753,34754,34755,34756,34757,34759,34760,34761,34764,34765,34766,34767,34768,34772,34773,34774,34775,34776,34777,34778,34780,34781,34782,34783,34785,34786,34787,34788,34790,34791,34792,34793,34795,34796,34797,34799,34800,34801,34802,34803,34804,34805,34806,34807,34808,0,34810,34811,34812,34813,34815,34816,34817,34818,34820,34821,34822,34823,34824,34825,34827,34828,34829,34830,34831,34832,34833,34834,34836,34839,34840,34841,34842,34844,34845,34846,34847,34848,34851,31232,24687,24076,24713,33181,22805,24796,29060,28911,28330,27728,29312,27268,34989,24109,20064,23219,21916,38115,27927,31995,38553,25103,32454,30606,34430,21283,38686,36758,26247,23777,20384,29421,19979,21414,22799,21523,25472,38184,20808,20185,40092,32420,21688,36132,34900,33335,38386,28046,24358,23244,26174,38505,29616,29486,21439,33146,39301,32673,23466,38519,38480,32447,30456,21410,38262,39321,31665,35140,28248,20065,32724,31077,35814,24819,21709,20139,39033,24055,27233,20687,21521,35937,33831,30813,38660,21066,21742,22179,38144,28040,23477,28102,26195,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34852,34853,34854,34855,34856,34857,34858,34859,34860,34861,34862,34863,34864,34865,34867,34868,34869,34870,34871,34872,34874,34875,34877,34878,34879,34881,34882,34883,34886,34887,34888,34889,34890,34891,34894,34895,34896,34897,34898,34899,34901,34902,34904,34906,34907,34908,34909,34910,34911,34912,34918,34919,34922,34925,34927,34929,34931,34932,34933,34934,34936,34937,34938,0,34939,34940,34944,34947,34950,34951,34953,34954,34956,34958,34959,34960,34961,34963,34964,34965,34967,34968,34969,34970,34971,34973,34974,34975,34976,34977,34979,34981,34982,34983,34984,34985,34986,23567,23389,26657,32918,21880,31505,25928,26964,20123,27463,34638,38795,21327,25375,25658,37034,26012,32961,35856,20889,26800,21368,34809,25032,27844,27899,35874,23633,34218,33455,38156,27427,36763,26032,24571,24515,20449,34885,26143,33125,29481,24826,20852,21009,22411,24418,37026,34892,37266,24184,26447,24615,22995,20804,20982,33016,21256,27769,38596,29066,20241,20462,32670,26429,21957,38152,31168,34966,32483,22687,25100,38656,34394,22040,39035,24464,35768,33988,37207,21465,26093,24207,30044,24676,32110,23167,32490,32493,36713,21927,23459,24748,26059,29572,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34988,34990,34991,34992,34994,34995,34996,34997,34998,35000,35001,35002,35003,35005,35006,35007,35008,35011,35012,35015,35016,35018,35019,35020,35021,35023,35024,35025,35027,35030,35031,35034,35035,35036,35037,35038,35040,35041,35046,35047,35049,35050,35051,35052,35053,35054,35055,35058,35061,35062,35063,35066,35067,35069,35071,35072,35073,35075,35076,35077,35078,35079,35080,0,35081,35083,35084,35085,35086,35087,35089,35092,35093,35094,35095,35096,35100,35101,35102,35103,35104,35106,35107,35108,35110,35111,35112,35113,35116,35117,35118,35119,35121,35122,35123,35125,35127,36873,30307,30505,32474,38772,34203,23398,31348,38634,34880,21195,29071,24490,26092,35810,23547,39535,24033,27529,27739,35757,35759,36874,36805,21387,25276,40486,40493,21568,20011,33469,29273,34460,23830,34905,28079,38597,21713,20122,35766,28937,21693,38409,28895,28153,30416,20005,30740,34578,23721,24310,35328,39068,38414,28814,27839,22852,25513,30524,34893,28436,33395,22576,29141,21388,30746,38593,21761,24422,28976,23476,35866,39564,27523,22830,40495,31207,26472,25196,20335,30113,32650,27915,38451,27687,20208,30162,20859,26679,28478,36992,33136,22934,29814,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35128,35129,35130,35131,35132,35133,35134,35135,35136,35138,35139,35141,35142,35143,35144,35145,35146,35147,35148,35149,35150,35151,35152,35153,35154,35155,35156,35157,35158,35159,35160,35161,35162,35163,35164,35165,35168,35169,35170,35171,35172,35173,35175,35176,35177,35178,35179,35180,35181,35182,35183,35184,35185,35186,35187,35188,35189,35190,35191,35192,35193,35194,35196,0,35197,35198,35200,35202,35204,35205,35207,35208,35209,35210,35211,35212,35213,35214,35215,35216,35217,35218,35219,35220,35221,35222,35223,35224,35225,35226,35227,35228,35229,35230,35231,35232,35233,25671,23591,36965,31377,35875,23002,21676,33280,33647,35201,32768,26928,22094,32822,29239,37326,20918,20063,39029,25494,19994,21494,26355,33099,22812,28082,19968,22777,21307,25558,38129,20381,20234,34915,39056,22839,36951,31227,20202,33008,30097,27778,23452,23016,24413,26885,34433,20506,24050,20057,30691,20197,33402,25233,26131,37009,23673,20159,24441,33222,36920,32900,30123,20134,35028,24847,27589,24518,20041,30410,28322,35811,35758,35850,35793,24322,32764,32716,32462,33589,33643,22240,27575,38899,38452,23035,21535,38134,28139,23493,39278,23609,24341,38544,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35234,35235,35236,35237,35238,35239,35240,35241,35242,35243,35244,35245,35246,35247,35248,35249,35250,35251,35252,35253,35254,35255,35256,35257,35258,35259,35260,35261,35262,35263,35264,35267,35277,35283,35284,35285,35287,35288,35289,35291,35293,35295,35296,35297,35298,35300,35303,35304,35305,35306,35308,35309,35310,35312,35313,35314,35316,35317,35318,35319,35320,35321,35322,0,35323,35324,35325,35326,35327,35329,35330,35331,35332,35333,35334,35336,35337,35338,35339,35340,35341,35342,35343,35344,35345,35346,35347,35348,35349,35350,35351,35352,35353,35354,35355,35356,35357,21360,33521,27185,23156,40560,24212,32552,33721,33828,33829,33639,34631,36814,36194,30408,24433,39062,30828,26144,21727,25317,20323,33219,30152,24248,38605,36362,34553,21647,27891,28044,27704,24703,21191,29992,24189,20248,24736,24551,23588,30001,37038,38080,29369,27833,28216,37193,26377,21451,21491,20305,37321,35825,21448,24188,36802,28132,20110,30402,27014,34398,24858,33286,20313,20446,36926,40060,24841,28189,28180,38533,20104,23089,38632,19982,23679,31161,23431,35821,32701,29577,22495,33419,37057,21505,36935,21947,23786,24481,24840,27442,29425,32946,35465,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35358,35359,35360,35361,35362,35363,35364,35365,35366,35367,35368,35369,35370,35371,35372,35373,35374,35375,35376,35377,35378,35379,35380,35381,35382,35383,35384,35385,35386,35387,35388,35389,35391,35392,35393,35394,35395,35396,35397,35398,35399,35401,35402,35403,35404,35405,35406,35407,35408,35409,35410,35411,35412,35413,35414,35415,35416,35417,35418,35419,35420,35421,35422,0,35423,35424,35425,35426,35427,35428,35429,35430,35431,35432,35433,35434,35435,35436,35437,35438,35439,35440,35441,35442,35443,35444,35445,35446,35447,35448,35450,35451,35452,35453,35454,35455,35456,28020,23507,35029,39044,35947,39533,40499,28170,20900,20803,22435,34945,21407,25588,36757,22253,21592,22278,29503,28304,32536,36828,33489,24895,24616,38498,26352,32422,36234,36291,38053,23731,31908,26376,24742,38405,32792,20113,37095,21248,38504,20801,36816,34164,37213,26197,38901,23381,21277,30776,26434,26685,21705,28798,23472,36733,20877,22312,21681,25874,26242,36190,36163,33039,33900,36973,31967,20991,34299,26531,26089,28577,34468,36481,22122,36896,30338,28790,29157,36131,25321,21017,27901,36156,24590,22686,24974,26366,36192,25166,21939,28195,26413,36711,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35457,35458,35459,35460,35461,35462,35463,35464,35467,35468,35469,35470,35471,35472,35473,35474,35476,35477,35478,35479,35480,35481,35482,35483,35484,35485,35486,35487,35488,35489,35490,35491,35492,35493,35494,35495,35496,35497,35498,35499,35500,35501,35502,35503,35504,35505,35506,35507,35508,35509,35510,35511,35512,35513,35514,35515,35516,35517,35518,35519,35520,35521,35522,0,35523,35524,35525,35526,35527,35528,35529,35530,35531,35532,35533,35534,35535,35536,35537,35538,35539,35540,35541,35542,35543,35544,35545,35546,35547,35548,35549,35550,35551,35552,35553,35554,35555,38113,38392,30504,26629,27048,21643,20045,28856,35784,25688,25995,23429,31364,20538,23528,30651,27617,35449,31896,27838,30415,26025,36759,23853,23637,34360,26632,21344,25112,31449,28251,32509,27167,31456,24432,28467,24352,25484,28072,26454,19976,24080,36134,20183,32960,30260,38556,25307,26157,25214,27836,36213,29031,32617,20806,32903,21484,36974,25240,21746,34544,36761,32773,38167,34071,36825,27993,29645,26015,30495,29956,30759,33275,36126,38024,20390,26517,30137,35786,38663,25391,38215,38453,33976,25379,30529,24449,29424,20105,24596,25972,25327,27491,25919,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35556,35557,35558,35559,35560,35561,35562,35563,35564,35565,35566,35567,35568,35569,35570,35571,35572,35573,35574,35575,35576,35577,35578,35579,35580,35581,35582,35583,35584,35585,35586,35587,35588,35589,35590,35592,35593,35594,35595,35596,35597,35598,35599,35600,35601,35602,35603,35604,35605,35606,35607,35608,35609,35610,35611,35612,35613,35614,35615,35616,35617,35618,35619,0,35620,35621,35623,35624,35625,35626,35627,35628,35629,35630,35631,35632,35633,35634,35635,35636,35637,35638,35639,35640,35641,35642,35643,35644,35645,35646,35647,35648,35649,35650,35651,35652,35653,24103,30151,37073,35777,33437,26525,25903,21553,34584,30693,32930,33026,27713,20043,32455,32844,30452,26893,27542,25191,20540,20356,22336,25351,27490,36286,21482,26088,32440,24535,25370,25527,33267,33268,32622,24092,23769,21046,26234,31209,31258,36136,28825,30164,28382,27835,31378,20013,30405,24544,38047,34935,32456,31181,32959,37325,20210,20247,33311,21608,24030,27954,35788,31909,36724,32920,24090,21650,30385,23449,26172,39588,29664,26666,34523,26417,29482,35832,35803,36880,31481,28891,29038,25284,30633,22065,20027,33879,26609,21161,34496,36142,38136,31569,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35654,35655,35656,35657,35658,35659,35660,35661,35662,35663,35664,35665,35666,35667,35668,35669,35670,35671,35672,35673,35674,35675,35676,35677,35678,35679,35680,35681,35682,35683,35684,35685,35687,35688,35689,35690,35691,35693,35694,35695,35696,35697,35698,35699,35700,35701,35702,35703,35704,35705,35706,35707,35708,35709,35710,35711,35712,35713,35714,35715,35716,35717,35718,0,35719,35720,35721,35722,35723,35724,35725,35726,35727,35728,35729,35730,35731,35732,35733,35734,35735,35736,35737,35738,35739,35740,35741,35742,35743,35756,35761,35771,35783,35792,35818,35849,35870,20303,27880,31069,39547,25235,29226,25341,19987,30742,36716,25776,36186,31686,26729,24196,35013,22918,25758,22766,29366,26894,38181,36861,36184,22368,32512,35846,20934,25417,25305,21331,26700,29730,33537,37196,21828,30528,28796,27978,20857,21672,36164,23039,28363,28100,23388,32043,20180,31869,28371,23376,33258,28173,23383,39683,26837,36394,23447,32508,24635,32437,37049,36208,22863,25549,31199,36275,21330,26063,31062,35781,38459,32452,38075,32386,22068,37257,26368,32618,23562,36981,26152,24038,20304,26590,20570,20316,22352,24231,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35896,35897,35898,35899,35900,35901,35902,35903,35904,35906,35907,35908,35909,35912,35914,35915,35917,35918,35919,35920,35921,35922,35923,35924,35926,35927,35928,35929,35931,35932,35933,35934,35935,35936,35939,35940,35941,35942,35943,35944,35945,35948,35949,35950,35951,35952,35953,35954,35956,35957,35958,35959,35963,35964,35965,35966,35967,35968,35969,35971,35972,35974,35975,0,35976,35979,35981,35982,35983,35984,35985,35986,35987,35989,35990,35991,35993,35994,35995,35996,35997,35998,35999,36000,36001,36002,36003,36004,36005,36006,36007,36008,36009,36010,36011,36012,36013,20109,19980,20800,19984,24319,21317,19989,20120,19998,39730,23404,22121,20008,31162,20031,21269,20039,22829,29243,21358,27664,22239,32996,39319,27603,30590,40727,20022,20127,40720,20060,20073,20115,33416,23387,21868,22031,20164,21389,21405,21411,21413,21422,38757,36189,21274,21493,21286,21294,21310,36188,21350,21347,20994,21000,21006,21037,21043,21055,21056,21068,21086,21089,21084,33967,21117,21122,21121,21136,21139,20866,32596,20155,20163,20169,20162,20200,20193,20203,20190,20251,20211,20258,20324,20213,20261,20263,20233,20267,20318,20327,25912,20314,20317,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36014,36015,36016,36017,36018,36019,36020,36021,36022,36023,36024,36025,36026,36027,36028,36029,36030,36031,36032,36033,36034,36035,36036,36037,36038,36039,36040,36041,36042,36043,36044,36045,36046,36047,36048,36049,36050,36051,36052,36053,36054,36055,36056,36057,36058,36059,36060,36061,36062,36063,36064,36065,36066,36067,36068,36069,36070,36071,36072,36073,36074,36075,36076,0,36077,36078,36079,36080,36081,36082,36083,36084,36085,36086,36087,36088,36089,36090,36091,36092,36093,36094,36095,36096,36097,36098,36099,36100,36101,36102,36103,36104,36105,36106,36107,36108,36109,20319,20311,20274,20285,20342,20340,20369,20361,20355,20367,20350,20347,20394,20348,20396,20372,20454,20456,20458,20421,20442,20451,20444,20433,20447,20472,20521,20556,20467,20524,20495,20526,20525,20478,20508,20492,20517,20520,20606,20547,20565,20552,20558,20588,20603,20645,20647,20649,20666,20694,20742,20717,20716,20710,20718,20743,20747,20189,27709,20312,20325,20430,40864,27718,31860,20846,24061,40649,39320,20865,22804,21241,21261,35335,21264,20971,22809,20821,20128,20822,20147,34926,34980,20149,33044,35026,31104,23348,34819,32696,20907,20913,20925,20924,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36110,36111,36112,36113,36114,36115,36116,36117,36118,36119,36120,36121,36122,36123,36124,36128,36177,36178,36183,36191,36197,36200,36201,36202,36204,36206,36207,36209,36210,36216,36217,36218,36219,36220,36221,36222,36223,36224,36226,36227,36230,36231,36232,36233,36236,36237,36238,36239,36240,36242,36243,36245,36246,36247,36248,36249,36250,36251,36252,36253,36254,36256,36257,0,36258,36260,36261,36262,36263,36264,36265,36266,36267,36268,36269,36270,36271,36272,36274,36278,36279,36281,36283,36285,36288,36289,36290,36293,36295,36296,36297,36298,36301,36304,36306,36307,36308,20935,20886,20898,20901,35744,35750,35751,35754,35764,35765,35767,35778,35779,35787,35791,35790,35794,35795,35796,35798,35800,35801,35804,35807,35808,35812,35816,35817,35822,35824,35827,35830,35833,35836,35839,35840,35842,35844,35847,35852,35855,35857,35858,35860,35861,35862,35865,35867,35864,35869,35871,35872,35873,35877,35879,35882,35883,35886,35887,35890,35891,35893,35894,21353,21370,38429,38434,38433,38449,38442,38461,38460,38466,38473,38484,38495,38503,38508,38514,38516,38536,38541,38551,38576,37015,37019,37021,37017,37036,37025,37044,37043,37046,37050,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36309,36312,36313,36316,36320,36321,36322,36325,36326,36327,36329,36333,36334,36336,36337,36338,36340,36342,36348,36350,36351,36352,36353,36354,36355,36356,36358,36359,36360,36363,36365,36366,36368,36369,36370,36371,36373,36374,36375,36376,36377,36378,36379,36380,36384,36385,36388,36389,36390,36391,36392,36395,36397,36400,36402,36403,36404,36406,36407,36408,36411,36412,36414,0,36415,36419,36421,36422,36428,36429,36430,36431,36432,36435,36436,36437,36438,36439,36440,36442,36443,36444,36445,36446,36447,36448,36449,36450,36451,36452,36453,36455,36456,36458,36459,36462,36465,37048,37040,37071,37061,37054,37072,37060,37063,37075,37094,37090,37084,37079,37083,37099,37103,37118,37124,37154,37150,37155,37169,37167,37177,37187,37190,21005,22850,21154,21164,21165,21182,21759,21200,21206,21232,21471,29166,30669,24308,20981,20988,39727,21430,24321,30042,24047,22348,22441,22433,22654,22716,22725,22737,22313,22316,22314,22323,22329,22318,22319,22364,22331,22338,22377,22405,22379,22406,22396,22395,22376,22381,22390,22387,22445,22436,22412,22450,22479,22439,22452,22419,22432,22485,22488,22490,22489,22482,22456,22516,22511,22520,22500,22493,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36467,36469,36471,36472,36473,36474,36475,36477,36478,36480,36482,36483,36484,36486,36488,36489,36490,36491,36492,36493,36494,36497,36498,36499,36501,36502,36503,36504,36505,36506,36507,36509,36511,36512,36513,36514,36515,36516,36517,36518,36519,36520,36521,36522,36525,36526,36528,36529,36531,36532,36533,36534,36535,36536,36537,36539,36540,36541,36542,36543,36544,36545,36546,0,36547,36548,36549,36550,36551,36552,36553,36554,36555,36556,36557,36559,36560,36561,36562,36563,36564,36565,36566,36567,36568,36569,36570,36571,36572,36573,36574,36575,36576,36577,36578,36579,36580,22539,22541,22525,22509,22528,22558,22553,22596,22560,22629,22636,22657,22665,22682,22656,39336,40729,25087,33401,33405,33407,33423,33418,33448,33412,33422,33425,33431,33433,33451,33464,33470,33456,33480,33482,33507,33432,33463,33454,33483,33484,33473,33449,33460,33441,33450,33439,33476,33486,33444,33505,33545,33527,33508,33551,33543,33500,33524,33490,33496,33548,33531,33491,33553,33562,33542,33556,33557,33504,33493,33564,33617,33627,33628,33544,33682,33596,33588,33585,33691,33630,33583,33615,33607,33603,33631,33600,33559,33632,33581,33594,33587,33638,33637,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36581,36582,36583,36584,36585,36586,36587,36588,36589,36590,36591,36592,36593,36594,36595,36596,36597,36598,36599,36600,36601,36602,36603,36604,36605,36606,36607,36608,36609,36610,36611,36612,36613,36614,36615,36616,36617,36618,36619,36620,36621,36622,36623,36624,36625,36626,36627,36628,36629,36630,36631,36632,36633,36634,36635,36636,36637,36638,36639,36640,36641,36642,36643,0,36644,36645,36646,36647,36648,36649,36650,36651,36652,36653,36654,36655,36656,36657,36658,36659,36660,36661,36662,36663,36664,36665,36666,36667,36668,36669,36670,36671,36672,36673,36674,36675,36676,33640,33563,33641,33644,33642,33645,33646,33712,33656,33715,33716,33696,33706,33683,33692,33669,33660,33718,33705,33661,33720,33659,33688,33694,33704,33722,33724,33729,33793,33765,33752,22535,33816,33803,33757,33789,33750,33820,33848,33809,33798,33748,33759,33807,33795,33784,33785,33770,33733,33728,33830,33776,33761,33884,33873,33882,33881,33907,33927,33928,33914,33929,33912,33852,33862,33897,33910,33932,33934,33841,33901,33985,33997,34000,34022,33981,34003,33994,33983,33978,34016,33953,33977,33972,33943,34021,34019,34060,29965,34104,34032,34105,34079,34106,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36677,36678,36679,36680,36681,36682,36683,36684,36685,36686,36687,36688,36689,36690,36691,36692,36693,36694,36695,36696,36697,36698,36699,36700,36701,36702,36703,36704,36705,36706,36707,36708,36709,36714,36736,36748,36754,36765,36768,36769,36770,36772,36773,36774,36775,36778,36780,36781,36782,36783,36786,36787,36788,36789,36791,36792,36794,36795,36796,36799,36800,36803,36806,0,36809,36810,36811,36812,36813,36815,36818,36822,36823,36826,36832,36833,36835,36839,36844,36847,36849,36850,36852,36853,36854,36858,36859,36860,36862,36863,36871,36872,36876,36878,36883,36885,36888,34134,34107,34047,34044,34137,34120,34152,34148,34142,34170,30626,34115,34162,34171,34212,34216,34183,34191,34169,34222,34204,34181,34233,34231,34224,34259,34241,34268,34303,34343,34309,34345,34326,34364,24318,24328,22844,22849,32823,22869,22874,22872,21263,23586,23589,23596,23604,25164,25194,25247,25275,25290,25306,25303,25326,25378,25334,25401,25419,25411,25517,25590,25457,25466,25486,25524,25453,25516,25482,25449,25518,25532,25586,25592,25568,25599,25540,25566,25550,25682,25542,25534,25669,25665,25611,25627,25632,25612,25638,25633,25694,25732,25709,25750,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,36889,36892,36899,36900,36901,36903,36904,36905,36906,36907,36908,36912,36913,36914,36915,36916,36919,36921,36922,36925,36927,36928,36931,36933,36934,36936,36937,36938,36939,36940,36942,36948,36949,36950,36953,36954,36956,36957,36958,36959,36960,36961,36964,36966,36967,36969,36970,36971,36972,36975,36976,36977,36978,36979,36982,36983,36984,36985,36986,36987,36988,36990,36993,0,36996,36997,36998,36999,37001,37002,37004,37005,37006,37007,37008,37010,37012,37014,37016,37018,37020,37022,37023,37024,37028,37029,37031,37032,37033,37035,37037,37042,37047,37052,37053,37055,37056,25722,25783,25784,25753,25786,25792,25808,25815,25828,25826,25865,25893,25902,24331,24530,29977,24337,21343,21489,21501,21481,21480,21499,21522,21526,21510,21579,21586,21587,21588,21590,21571,21537,21591,21593,21539,21554,21634,21652,21623,21617,21604,21658,21659,21636,21622,21606,21661,21712,21677,21698,21684,21714,21671,21670,21715,21716,21618,21667,21717,21691,21695,21708,21721,21722,21724,21673,21674,21668,21725,21711,21726,21787,21735,21792,21757,21780,21747,21794,21795,21775,21777,21799,21802,21863,21903,21941,21833,21869,21825,21845,21823,21840,21820,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37058,37059,37062,37064,37065,37067,37068,37069,37074,37076,37077,37078,37080,37081,37082,37086,37087,37088,37091,37092,37093,37097,37098,37100,37102,37104,37105,37106,37107,37109,37110,37111,37113,37114,37115,37116,37119,37120,37121,37123,37125,37126,37127,37128,37129,37130,37131,37132,37133,37134,37135,37136,37137,37138,37139,37140,37141,37142,37143,37144,37146,37147,37148,0,37149,37151,37152,37153,37156,37157,37158,37159,37160,37161,37162,37163,37164,37165,37166,37168,37170,37171,37172,37173,37174,37175,37176,37178,37179,37180,37181,37182,37183,37184,37185,37186,37188,21815,21846,21877,21878,21879,21811,21808,21852,21899,21970,21891,21937,21945,21896,21889,21919,21886,21974,21905,21883,21983,21949,21950,21908,21913,21994,22007,21961,22047,21969,21995,21996,21972,21990,21981,21956,21999,21989,22002,22003,21964,21965,21992,22005,21988,36756,22046,22024,22028,22017,22052,22051,22014,22016,22055,22061,22104,22073,22103,22060,22093,22114,22105,22108,22092,22100,22150,22116,22129,22123,22139,22140,22149,22163,22191,22228,22231,22237,22241,22261,22251,22265,22271,22276,22282,22281,22300,24079,24089,24084,24081,24113,24123,24124,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37189,37191,37192,37201,37203,37204,37205,37206,37208,37209,37211,37212,37215,37216,37222,37223,37224,37227,37229,37235,37242,37243,37244,37248,37249,37250,37251,37252,37254,37256,37258,37262,37263,37267,37268,37269,37270,37271,37272,37273,37276,37277,37278,37279,37280,37281,37284,37285,37286,37287,37288,37289,37291,37292,37296,37297,37298,37299,37302,37303,37304,37305,37307,0,37308,37309,37310,37311,37312,37313,37314,37315,37316,37317,37318,37320,37323,37328,37330,37331,37332,37333,37334,37335,37336,37337,37338,37339,37341,37342,37343,37344,37345,37346,37347,37348,37349,24119,24132,24148,24155,24158,24161,23692,23674,23693,23696,23702,23688,23704,23705,23697,23706,23708,23733,23714,23741,23724,23723,23729,23715,23745,23735,23748,23762,23780,23755,23781,23810,23811,23847,23846,23854,23844,23838,23814,23835,23896,23870,23860,23869,23916,23899,23919,23901,23915,23883,23882,23913,23924,23938,23961,23965,35955,23991,24005,24435,24439,24450,24455,24457,24460,24469,24473,24476,24488,24493,24501,24508,34914,24417,29357,29360,29364,29367,29368,29379,29377,29390,29389,29394,29416,29423,29417,29426,29428,29431,29441,29427,29443,29434,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37350,37351,37352,37353,37354,37355,37356,37357,37358,37359,37360,37361,37362,37363,37364,37365,37366,37367,37368,37369,37370,37371,37372,37373,37374,37375,37376,37377,37378,37379,37380,37381,37382,37383,37384,37385,37386,37387,37388,37389,37390,37391,37392,37393,37394,37395,37396,37397,37398,37399,37400,37401,37402,37403,37404,37405,37406,37407,37408,37409,37410,37411,37412,0,37413,37414,37415,37416,37417,37418,37419,37420,37421,37422,37423,37424,37425,37426,37427,37428,37429,37430,37431,37432,37433,37434,37435,37436,37437,37438,37439,37440,37441,37442,37443,37444,37445,29435,29463,29459,29473,29450,29470,29469,29461,29474,29497,29477,29484,29496,29489,29520,29517,29527,29536,29548,29551,29566,33307,22821,39143,22820,22786,39267,39271,39272,39273,39274,39275,39276,39284,39287,39293,39296,39300,39303,39306,39309,39312,39313,39315,39316,39317,24192,24209,24203,24214,24229,24224,24249,24245,24254,24243,36179,24274,24273,24283,24296,24298,33210,24516,24521,24534,24527,24579,24558,24580,24545,24548,24574,24581,24582,24554,24557,24568,24601,24629,24614,24603,24591,24589,24617,24619,24586,24639,24609,24696,24697,24699,24698,24642,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37446,37447,37448,37449,37450,37451,37452,37453,37454,37455,37456,37457,37458,37459,37460,37461,37462,37463,37464,37465,37466,37467,37468,37469,37470,37471,37472,37473,37474,37475,37476,37477,37478,37479,37480,37481,37482,37483,37484,37485,37486,37487,37488,37489,37490,37491,37493,37494,37495,37496,37497,37498,37499,37500,37501,37502,37503,37504,37505,37506,37507,37508,37509,0,37510,37511,37512,37513,37514,37515,37516,37517,37519,37520,37521,37522,37523,37524,37525,37526,37527,37528,37529,37530,37531,37532,37533,37534,37535,37536,37537,37538,37539,37540,37541,37542,37543,24682,24701,24726,24730,24749,24733,24707,24722,24716,24731,24812,24763,24753,24797,24792,24774,24794,24756,24864,24870,24853,24867,24820,24832,24846,24875,24906,24949,25004,24980,24999,25015,25044,25077,24541,38579,38377,38379,38385,38387,38389,38390,38396,38398,38403,38404,38406,38408,38410,38411,38412,38413,38415,38418,38421,38422,38423,38425,38426,20012,29247,25109,27701,27732,27740,27722,27811,27781,27792,27796,27788,27752,27753,27764,27766,27782,27817,27856,27860,27821,27895,27896,27889,27863,27826,27872,27862,27898,27883,27886,27825,27859,27887,27902,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37544,37545,37546,37547,37548,37549,37551,37552,37553,37554,37555,37556,37557,37558,37559,37560,37561,37562,37563,37564,37565,37566,37567,37568,37569,37570,37571,37572,37573,37574,37575,37577,37578,37579,37580,37581,37582,37583,37584,37585,37586,37587,37588,37589,37590,37591,37592,37593,37594,37595,37596,37597,37598,37599,37600,37601,37602,37603,37604,37605,37606,37607,37608,0,37609,37610,37611,37612,37613,37614,37615,37616,37617,37618,37619,37620,37621,37622,37623,37624,37625,37626,37627,37628,37629,37630,37631,37632,37633,37634,37635,37636,37637,37638,37639,37640,37641,27961,27943,27916,27971,27976,27911,27908,27929,27918,27947,27981,27950,27957,27930,27983,27986,27988,27955,28049,28015,28062,28064,27998,28051,28052,27996,28000,28028,28003,28186,28103,28101,28126,28174,28095,28128,28177,28134,28125,28121,28182,28075,28172,28078,28203,28270,28238,28267,28338,28255,28294,28243,28244,28210,28197,28228,28383,28337,28312,28384,28461,28386,28325,28327,28349,28347,28343,28375,28340,28367,28303,28354,28319,28514,28486,28487,28452,28437,28409,28463,28470,28491,28532,28458,28425,28457,28553,28557,28556,28536,28530,28540,28538,28625,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37642,37643,37644,37645,37646,37647,37648,37649,37650,37651,37652,37653,37654,37655,37656,37657,37658,37659,37660,37661,37662,37663,37664,37665,37666,37667,37668,37669,37670,37671,37672,37673,37674,37675,37676,37677,37678,37679,37680,37681,37682,37683,37684,37685,37686,37687,37688,37689,37690,37691,37692,37693,37695,37696,37697,37698,37699,37700,37701,37702,37703,37704,37705,0,37706,37707,37708,37709,37710,37711,37712,37713,37714,37715,37716,37717,37718,37719,37720,37721,37722,37723,37724,37725,37726,37727,37728,37729,37730,37731,37732,37733,37734,37735,37736,37737,37739,28617,28583,28601,28598,28610,28641,28654,28638,28640,28655,28698,28707,28699,28729,28725,28751,28766,23424,23428,23445,23443,23461,23480,29999,39582,25652,23524,23534,35120,23536,36423,35591,36790,36819,36821,36837,36846,36836,36841,36838,36851,36840,36869,36868,36875,36902,36881,36877,36886,36897,36917,36918,36909,36911,36932,36945,36946,36944,36968,36952,36962,36955,26297,36980,36989,36994,37000,36995,37003,24400,24407,24406,24408,23611,21675,23632,23641,23409,23651,23654,32700,24362,24361,24365,33396,24380,39739,23662,22913,22915,22925,22953,22954,22947,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37740,37741,37742,37743,37744,37745,37746,37747,37748,37749,37750,37751,37752,37753,37754,37755,37756,37757,37758,37759,37760,37761,37762,37763,37764,37765,37766,37767,37768,37769,37770,37771,37772,37773,37774,37776,37777,37778,37779,37780,37781,37782,37783,37784,37785,37786,37787,37788,37789,37790,37791,37792,37793,37794,37795,37796,37797,37798,37799,37800,37801,37802,37803,0,37804,37805,37806,37807,37808,37809,37810,37811,37812,37813,37814,37815,37816,37817,37818,37819,37820,37821,37822,37823,37824,37825,37826,37827,37828,37829,37830,37831,37832,37833,37835,37836,37837,22935,22986,22955,22942,22948,22994,22962,22959,22999,22974,23045,23046,23005,23048,23011,23000,23033,23052,23049,23090,23092,23057,23075,23059,23104,23143,23114,23125,23100,23138,23157,33004,23210,23195,23159,23162,23230,23275,23218,23250,23252,23224,23264,23267,23281,23254,23270,23256,23260,23305,23319,23318,23346,23351,23360,23573,23580,23386,23397,23411,23377,23379,23394,39541,39543,39544,39546,39551,39549,39552,39553,39557,39560,39562,39568,39570,39571,39574,39576,39579,39580,39581,39583,39584,39586,39587,39589,39591,32415,32417,32419,32421,32424,32425,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37838,37839,37840,37841,37842,37843,37844,37845,37847,37848,37849,37850,37851,37852,37853,37854,37855,37856,37857,37858,37859,37860,37861,37862,37863,37864,37865,37866,37867,37868,37869,37870,37871,37872,37873,37874,37875,37876,37877,37878,37879,37880,37881,37882,37883,37884,37885,37886,37887,37888,37889,37890,37891,37892,37893,37894,37895,37896,37897,37898,37899,37900,37901,0,37902,37903,37904,37905,37906,37907,37908,37909,37910,37911,37912,37913,37914,37915,37916,37917,37918,37919,37920,37921,37922,37923,37924,37925,37926,37927,37928,37929,37930,37931,37932,37933,37934,32429,32432,32446,32448,32449,32450,32457,32459,32460,32464,32468,32471,32475,32480,32481,32488,32491,32494,32495,32497,32498,32525,32502,32506,32507,32510,32513,32514,32515,32519,32520,32523,32524,32527,32529,32530,32535,32537,32540,32539,32543,32545,32546,32547,32548,32549,32550,32551,32554,32555,32556,32557,32559,32560,32561,32562,32563,32565,24186,30079,24027,30014,37013,29582,29585,29614,29602,29599,29647,29634,29649,29623,29619,29632,29641,29640,29669,29657,39036,29706,29673,29671,29662,29626,29682,29711,29738,29787,29734,29733,29736,29744,29742,29740,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,37935,37936,37937,37938,37939,37940,37941,37942,37943,37944,37945,37946,37947,37948,37949,37951,37952,37953,37954,37955,37956,37957,37958,37959,37960,37961,37962,37963,37964,37965,37966,37967,37968,37969,37970,37971,37972,37973,37974,37975,37976,37977,37978,37979,37980,37981,37982,37983,37984,37985,37986,37987,37988,37989,37990,37991,37992,37993,37994,37996,37997,37998,37999,0,38000,38001,38002,38003,38004,38005,38006,38007,38008,38009,38010,38011,38012,38013,38014,38015,38016,38017,38018,38019,38020,38033,38038,38040,38087,38095,38099,38100,38106,38118,38139,38172,38176,29723,29722,29761,29788,29783,29781,29785,29815,29805,29822,29852,29838,29824,29825,29831,29835,29854,29864,29865,29840,29863,29906,29882,38890,38891,38892,26444,26451,26462,26440,26473,26533,26503,26474,26483,26520,26535,26485,26536,26526,26541,26507,26487,26492,26608,26633,26584,26634,26601,26544,26636,26585,26549,26586,26547,26589,26624,26563,26552,26594,26638,26561,26621,26674,26675,26720,26721,26702,26722,26692,26724,26755,26653,26709,26726,26689,26727,26688,26686,26698,26697,26665,26805,26767,26740,26743,26771,26731,26818,26990,26876,26911,26912,26873,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38183,38195,38205,38211,38216,38219,38229,38234,38240,38254,38260,38261,38263,38264,38265,38266,38267,38268,38269,38270,38272,38273,38274,38275,38276,38277,38278,38279,38280,38281,38282,38283,38284,38285,38286,38287,38288,38289,38290,38291,38292,38293,38294,38295,38296,38297,38298,38299,38300,38301,38302,38303,38304,38305,38306,38307,38308,38309,38310,38311,38312,38313,38314,0,38315,38316,38317,38318,38319,38320,38321,38322,38323,38324,38325,38326,38327,38328,38329,38330,38331,38332,38333,38334,38335,38336,38337,38338,38339,38340,38341,38342,38343,38344,38345,38346,38347,26916,26864,26891,26881,26967,26851,26896,26993,26937,26976,26946,26973,27012,26987,27008,27032,27000,26932,27084,27015,27016,27086,27017,26982,26979,27001,27035,27047,27067,27051,27053,27092,27057,27073,27082,27103,27029,27104,27021,27135,27183,27117,27159,27160,27237,27122,27204,27198,27296,27216,27227,27189,27278,27257,27197,27176,27224,27260,27281,27280,27305,27287,27307,29495,29522,27521,27522,27527,27524,27538,27539,27533,27546,27547,27553,27562,36715,36717,36721,36722,36723,36725,36726,36728,36727,36729,36730,36732,36734,36737,36738,36740,36743,36747,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38348,38349,38350,38351,38352,38353,38354,38355,38356,38357,38358,38359,38360,38361,38362,38363,38364,38365,38366,38367,38368,38369,38370,38371,38372,38373,38374,38375,38380,38399,38407,38419,38424,38427,38430,38432,38435,38436,38437,38438,38439,38440,38441,38443,38444,38445,38447,38448,38455,38456,38457,38458,38462,38465,38467,38474,38478,38479,38481,38482,38483,38486,38487,0,38488,38489,38490,38492,38493,38494,38496,38499,38501,38502,38507,38509,38510,38511,38512,38513,38515,38520,38521,38522,38523,38524,38525,38526,38527,38528,38529,38530,38531,38532,38535,38537,38538,36749,36750,36751,36760,36762,36558,25099,25111,25115,25119,25122,25121,25125,25124,25132,33255,29935,29940,29951,29967,29969,29971,25908,26094,26095,26096,26122,26137,26482,26115,26133,26112,28805,26359,26141,26164,26161,26166,26165,32774,26207,26196,26177,26191,26198,26209,26199,26231,26244,26252,26279,26269,26302,26331,26332,26342,26345,36146,36147,36150,36155,36157,36160,36165,36166,36168,36169,36167,36173,36181,36185,35271,35274,35275,35276,35278,35279,35280,35281,29294,29343,29277,29286,29295,29310,29311,29316,29323,29325,29327,29330,25352,25394,25520,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38540,38542,38545,38546,38547,38549,38550,38554,38555,38557,38558,38559,38560,38561,38562,38563,38564,38565,38566,38568,38569,38570,38571,38572,38573,38574,38575,38577,38578,38580,38581,38583,38584,38586,38587,38591,38594,38595,38600,38602,38603,38608,38609,38611,38612,38614,38615,38616,38617,38618,38619,38620,38621,38622,38623,38625,38626,38627,38628,38629,38630,38631,38635,0,38636,38637,38638,38640,38641,38642,38644,38645,38648,38650,38651,38652,38653,38655,38658,38659,38661,38666,38667,38668,38672,38673,38674,38676,38677,38679,38680,38681,38682,38683,38685,38687,38688,25663,25816,32772,27626,27635,27645,27637,27641,27653,27655,27654,27661,27669,27672,27673,27674,27681,27689,27684,27690,27698,25909,25941,25963,29261,29266,29270,29232,34402,21014,32927,32924,32915,32956,26378,32957,32945,32939,32941,32948,32951,32999,33000,33001,33002,32987,32962,32964,32985,32973,32983,26384,32989,33003,33009,33012,33005,33037,33038,33010,33020,26389,33042,35930,33078,33054,33068,33048,33074,33096,33100,33107,33140,33113,33114,33137,33120,33129,33148,33149,33133,33127,22605,23221,33160,33154,33169,28373,33187,33194,33228,26406,33226,33211,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38689,38690,38691,38692,38693,38694,38695,38696,38697,38699,38700,38702,38703,38705,38707,38708,38709,38710,38711,38714,38715,38716,38717,38719,38720,38721,38722,38723,38724,38725,38726,38727,38728,38729,38730,38731,38732,38733,38734,38735,38736,38737,38740,38741,38743,38744,38746,38748,38749,38751,38755,38756,38758,38759,38760,38762,38763,38764,38765,38766,38767,38768,38769,0,38770,38773,38775,38776,38777,38778,38779,38781,38782,38783,38784,38785,38786,38787,38788,38790,38791,38792,38793,38794,38796,38798,38799,38800,38803,38805,38806,38807,38809,38810,38811,38812,38813,33217,33190,27428,27447,27449,27459,27462,27481,39121,39122,39123,39125,39129,39130,27571,24384,27586,35315,26000,40785,26003,26044,26054,26052,26051,26060,26062,26066,26070,28800,28828,28822,28829,28859,28864,28855,28843,28849,28904,28874,28944,28947,28950,28975,28977,29043,29020,29032,28997,29042,29002,29048,29050,29080,29107,29109,29096,29088,29152,29140,29159,29177,29213,29224,28780,28952,29030,29113,25150,25149,25155,25160,25161,31035,31040,31046,31049,31067,31068,31059,31066,31074,31063,31072,31087,31079,31098,31109,31114,31130,31143,31155,24529,24528,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38814,38815,38817,38818,38820,38821,38822,38823,38824,38825,38826,38828,38830,38832,38833,38835,38837,38838,38839,38840,38841,38842,38843,38844,38845,38846,38847,38848,38849,38850,38851,38852,38853,38854,38855,38856,38857,38858,38859,38860,38861,38862,38863,38864,38865,38866,38867,38868,38869,38870,38871,38872,38873,38874,38875,38876,38877,38878,38879,38880,38881,38882,38883,0,38884,38885,38888,38894,38895,38896,38897,38898,38900,38903,38904,38905,38906,38907,38908,38909,38910,38911,38912,38913,38914,38915,38916,38917,38918,38919,38920,38921,38922,38923,38924,38925,38926,24636,24669,24666,24679,24641,24665,24675,24747,24838,24845,24925,25001,24989,25035,25041,25094,32896,32895,27795,27894,28156,30710,30712,30720,30729,30743,30744,30737,26027,30765,30748,30749,30777,30778,30779,30751,30780,30757,30764,30755,30761,30798,30829,30806,30807,30758,30800,30791,30796,30826,30875,30867,30874,30855,30876,30881,30883,30898,30905,30885,30932,30937,30921,30956,30962,30981,30964,30995,31012,31006,31028,40859,40697,40699,40700,30449,30468,30477,30457,30471,30472,30490,30498,30489,30509,30502,30517,30520,30544,30545,30535,30531,30554,30568,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38927,38928,38929,38930,38931,38932,38933,38934,38935,38936,38937,38938,38939,38940,38941,38942,38943,38944,38945,38946,38947,38948,38949,38950,38951,38952,38953,38954,38955,38956,38957,38958,38959,38960,38961,38962,38963,38964,38965,38966,38967,38968,38969,38970,38971,38972,38973,38974,38975,38976,38977,38978,38979,38980,38981,38982,38983,38984,38985,38986,38987,38988,38989,0,38990,38991,38992,38993,38994,38995,38996,38997,38998,38999,39000,39001,39002,39003,39004,39005,39006,39007,39008,39009,39010,39011,39012,39013,39014,39015,39016,39017,39018,39019,39020,39021,39022,30562,30565,30591,30605,30589,30592,30604,30609,30623,30624,30640,30645,30653,30010,30016,30030,30027,30024,30043,30066,30073,30083,32600,32609,32607,35400,32616,32628,32625,32633,32641,32638,30413,30437,34866,38021,38022,38023,38027,38026,38028,38029,38031,38032,38036,38039,38037,38042,38043,38044,38051,38052,38059,38058,38061,38060,38063,38064,38066,38068,38070,38071,38072,38073,38074,38076,38077,38079,38084,38088,38089,38090,38091,38092,38093,38094,38096,38097,38098,38101,38102,38103,38105,38104,38107,38110,38111,38112,38114,38116,38117,38119,38120,38122,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39023,39024,39025,39026,39027,39028,39051,39054,39058,39061,39065,39075,39080,39081,39082,39083,39084,39085,39086,39087,39088,39089,39090,39091,39092,39093,39094,39095,39096,39097,39098,39099,39100,39101,39102,39103,39104,39105,39106,39107,39108,39109,39110,39111,39112,39113,39114,39115,39116,39117,39119,39120,39124,39126,39127,39131,39132,39133,39136,39137,39138,39139,39140,0,39141,39142,39145,39146,39147,39148,39149,39150,39151,39152,39153,39154,39155,39156,39157,39158,39159,39160,39161,39162,39163,39164,39165,39166,39167,39168,39169,39170,39171,39172,39173,39174,39175,38121,38123,38126,38127,38131,38132,38133,38135,38137,38140,38141,38143,38147,38146,38150,38151,38153,38154,38157,38158,38159,38162,38163,38164,38165,38166,38168,38171,38173,38174,38175,38178,38186,38187,38185,38188,38193,38194,38196,38198,38199,38200,38204,38206,38207,38210,38197,38212,38213,38214,38217,38220,38222,38223,38226,38227,38228,38230,38231,38232,38233,38235,38238,38239,38237,38241,38242,38244,38245,38246,38247,38248,38249,38250,38251,38252,38255,38257,38258,38259,38202,30695,30700,38601,31189,31213,31203,31211,31238,23879,31235,31234,31262,31252,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39176,39177,39178,39179,39180,39182,39183,39185,39186,39187,39188,39189,39190,39191,39192,39193,39194,39195,39196,39197,39198,39199,39200,39201,39202,39203,39204,39205,39206,39207,39208,39209,39210,39211,39212,39213,39215,39216,39217,39218,39219,39220,39221,39222,39223,39224,39225,39226,39227,39228,39229,39230,39231,39232,39233,39234,39235,39236,39237,39238,39239,39240,39241,0,39242,39243,39244,39245,39246,39247,39248,39249,39250,39251,39254,39255,39256,39257,39258,39259,39260,39261,39262,39263,39264,39265,39266,39268,39270,39283,39288,39289,39291,39294,39298,39299,39305,31289,31287,31313,40655,39333,31344,30344,30350,30355,30361,30372,29918,29920,29996,40480,40482,40488,40489,40490,40491,40492,40498,40497,40502,40504,40503,40505,40506,40510,40513,40514,40516,40518,40519,40520,40521,40523,40524,40526,40529,40533,40535,40538,40539,40540,40542,40547,40550,40551,40552,40553,40554,40555,40556,40561,40557,40563,30098,30100,30102,30112,30109,30124,30115,30131,30132,30136,30148,30129,30128,30147,30146,30166,30157,30179,30184,30182,30180,30187,30183,30211,30193,30204,30207,30224,30208,30213,30220,30231,30218,30245,30232,30229,30233,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39308,39310,39322,39323,39324,39325,39326,39327,39328,39329,39330,39331,39332,39334,39335,39337,39338,39339,39340,39341,39342,39343,39344,39345,39346,39347,39348,39349,39350,39351,39352,39353,39354,39355,39356,39357,39358,39359,39360,39361,39362,39363,39364,39365,39366,39367,39368,39369,39370,39371,39372,39373,39374,39375,39376,39377,39378,39379,39380,39381,39382,39383,39384,0,39385,39386,39387,39388,39389,39390,39391,39392,39393,39394,39395,39396,39397,39398,39399,39400,39401,39402,39403,39404,39405,39406,39407,39408,39409,39410,39411,39412,39413,39414,39415,39416,39417,30235,30268,30242,30240,30272,30253,30256,30271,30261,30275,30270,30259,30285,30302,30292,30300,30294,30315,30319,32714,31462,31352,31353,31360,31366,31368,31381,31398,31392,31404,31400,31405,31411,34916,34921,34930,34941,34943,34946,34978,35014,34999,35004,35017,35042,35022,35043,35045,35057,35098,35068,35048,35070,35056,35105,35097,35091,35099,35082,35124,35115,35126,35137,35174,35195,30091,32997,30386,30388,30684,32786,32788,32790,32796,32800,32802,32805,32806,32807,32809,32808,32817,32779,32821,32835,32838,32845,32850,32873,32881,35203,39032,39040,39043,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39418,39419,39420,39421,39422,39423,39424,39425,39426,39427,39428,39429,39430,39431,39432,39433,39434,39435,39436,39437,39438,39439,39440,39441,39442,39443,39444,39445,39446,39447,39448,39449,39450,39451,39452,39453,39454,39455,39456,39457,39458,39459,39460,39461,39462,39463,39464,39465,39466,39467,39468,39469,39470,39471,39472,39473,39474,39475,39476,39477,39478,39479,39480,0,39481,39482,39483,39484,39485,39486,39487,39488,39489,39490,39491,39492,39493,39494,39495,39496,39497,39498,39499,39500,39501,39502,39503,39504,39505,39506,39507,39508,39509,39510,39511,39512,39513,39049,39052,39053,39055,39060,39066,39067,39070,39071,39073,39074,39077,39078,34381,34388,34412,34414,34431,34426,34428,34427,34472,34445,34443,34476,34461,34471,34467,34474,34451,34473,34486,34500,34485,34510,34480,34490,34481,34479,34505,34511,34484,34537,34545,34546,34541,34547,34512,34579,34526,34548,34527,34520,34513,34563,34567,34552,34568,34570,34573,34569,34595,34619,34590,34597,34606,34586,34622,34632,34612,34609,34601,34615,34623,34690,34594,34685,34686,34683,34656,34672,34636,34670,34699,34643,34659,34684,34660,34649,34661,34707,34735,34728,34770,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39514,39515,39516,39517,39518,39519,39520,39521,39522,39523,39524,39525,39526,39527,39528,39529,39530,39531,39538,39555,39561,39565,39566,39572,39573,39577,39590,39593,39594,39595,39596,39597,39598,39599,39602,39603,39604,39605,39609,39611,39613,39614,39615,39619,39620,39622,39623,39624,39625,39626,39629,39630,39631,39632,39634,39636,39637,39638,39639,39641,39642,39643,39644,0,39645,39646,39648,39650,39651,39652,39653,39655,39656,39657,39658,39660,39662,39664,39665,39666,39667,39668,39669,39670,39671,39672,39674,39676,39677,39678,39679,39680,39681,39682,39684,39685,39686,34758,34696,34693,34733,34711,34691,34731,34789,34732,34741,34739,34763,34771,34749,34769,34752,34762,34779,34794,34784,34798,34838,34835,34814,34826,34843,34849,34873,34876,32566,32578,32580,32581,33296,31482,31485,31496,31491,31492,31509,31498,31531,31503,31559,31544,31530,31513,31534,31537,31520,31525,31524,31539,31550,31518,31576,31578,31557,31605,31564,31581,31584,31598,31611,31586,31602,31601,31632,31654,31655,31672,31660,31645,31656,31621,31658,31644,31650,31659,31668,31697,31681,31692,31709,31706,31717,31718,31722,31756,31742,31740,31759,31766,31755,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39687,39689,39690,39691,39692,39693,39694,39696,39697,39698,39700,39701,39702,39703,39704,39705,39706,39707,39708,39709,39710,39712,39713,39714,39716,39717,39718,39719,39720,39721,39722,39723,39724,39725,39726,39728,39729,39731,39732,39733,39734,39735,39736,39737,39738,39741,39742,39743,39744,39750,39754,39755,39756,39758,39760,39762,39763,39765,39766,39767,39768,39769,39770,0,39771,39772,39773,39774,39775,39776,39777,39778,39779,39780,39781,39782,39783,39784,39785,39786,39787,39788,39789,39790,39791,39792,39793,39794,39795,39796,39797,39798,39799,39800,39801,39802,39803,31775,31786,31782,31800,31809,31808,33278,33281,33282,33284,33260,34884,33313,33314,33315,33325,33327,33320,33323,33336,33339,33331,33332,33342,33348,33353,33355,33359,33370,33375,33384,34942,34949,34952,35032,35039,35166,32669,32671,32679,32687,32688,32690,31868,25929,31889,31901,31900,31902,31906,31922,31932,31933,31937,31943,31948,31949,31944,31941,31959,31976,33390,26280,32703,32718,32725,32741,32737,32742,32745,32750,32755,31992,32119,32166,32174,32327,32411,40632,40628,36211,36228,36244,36241,36273,36199,36205,35911,35913,37194,37200,37198,37199,37220,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39804,39805,39806,39807,39808,39809,39810,39811,39812,39813,39814,39815,39816,39817,39818,39819,39820,39821,39822,39823,39824,39825,39826,39827,39828,39829,39830,39831,39832,39833,39834,39835,39836,39837,39838,39839,39840,39841,39842,39843,39844,39845,39846,39847,39848,39849,39850,39851,39852,39853,39854,39855,39856,39857,39858,39859,39860,39861,39862,39863,39864,39865,39866,0,39867,39868,39869,39870,39871,39872,39873,39874,39875,39876,39877,39878,39879,39880,39881,39882,39883,39884,39885,39886,39887,39888,39889,39890,39891,39892,39893,39894,39895,39896,39897,39898,39899,37218,37217,37232,37225,37231,37245,37246,37234,37236,37241,37260,37253,37264,37261,37265,37282,37283,37290,37293,37294,37295,37301,37300,37306,35925,40574,36280,36331,36357,36441,36457,36277,36287,36284,36282,36292,36310,36311,36314,36318,36302,36303,36315,36294,36332,36343,36344,36323,36345,36347,36324,36361,36349,36372,36381,36383,36396,36398,36387,36399,36410,36416,36409,36405,36413,36401,36425,36417,36418,36433,36434,36426,36464,36470,36476,36463,36468,36485,36495,36500,36496,36508,36510,35960,35970,35978,35973,35992,35988,26011,35286,35294,35290,35292,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39900,39901,39902,39903,39904,39905,39906,39907,39908,39909,39910,39911,39912,39913,39914,39915,39916,39917,39918,39919,39920,39921,39922,39923,39924,39925,39926,39927,39928,39929,39930,39931,39932,39933,39934,39935,39936,39937,39938,39939,39940,39941,39942,39943,39944,39945,39946,39947,39948,39949,39950,39951,39952,39953,39954,39955,39956,39957,39958,39959,39960,39961,39962,0,39963,39964,39965,39966,39967,39968,39969,39970,39971,39972,39973,39974,39975,39976,39977,39978,39979,39980,39981,39982,39983,39984,39985,39986,39987,39988,39989,39990,39991,39992,39993,39994,39995,35301,35307,35311,35390,35622,38739,38633,38643,38639,38662,38657,38664,38671,38670,38698,38701,38704,38718,40832,40835,40837,40838,40839,40840,40841,40842,40844,40702,40715,40717,38585,38588,38589,38606,38610,30655,38624,37518,37550,37576,37694,37738,37834,37775,37950,37995,40063,40066,40069,40070,40071,40072,31267,40075,40078,40080,40081,40082,40084,40085,40090,40091,40094,40095,40096,40097,40098,40099,40101,40102,40103,40104,40105,40107,40109,40110,40112,40113,40114,40115,40116,40117,40118,40119,40122,40123,40124,40125,40132,40133,40134,40135,40138,40139,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,39996,39997,39998,39999,40000,40001,40002,40003,40004,40005,40006,40007,40008,40009,40010,40011,40012,40013,40014,40015,40016,40017,40018,40019,40020,40021,40022,40023,40024,40025,40026,40027,40028,40029,40030,40031,40032,40033,40034,40035,40036,40037,40038,40039,40040,40041,40042,40043,40044,40045,40046,40047,40048,40049,40050,40051,40052,40053,40054,40055,40056,40057,40058,0,40059,40061,40062,40064,40067,40068,40073,40074,40076,40079,40083,40086,40087,40088,40089,40093,40106,40108,40111,40121,40126,40127,40128,40129,40130,40136,40137,40145,40146,40154,40155,40160,40161,40140,40141,40142,40143,40144,40147,40148,40149,40151,40152,40153,40156,40157,40159,40162,38780,38789,38801,38802,38804,38831,38827,38819,38834,38836,39601,39600,39607,40536,39606,39610,39612,39617,39616,39621,39618,39627,39628,39633,39749,39747,39751,39753,39752,39757,39761,39144,39181,39214,39253,39252,39647,39649,39654,39663,39659,39675,39661,39673,39688,39695,39699,39711,39715,40637,40638,32315,40578,40583,40584,40587,40594,37846,40605,40607,40667,40668,40669,40672,40671,40674,40681,40679,40677,40682,40687,40738,40748,40751,40761,40759,40765,40766,40772,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40163,40164,40165,40166,40167,40168,40169,40170,40171,40172,40173,40174,40175,40176,40177,40178,40179,40180,40181,40182,40183,40184,40185,40186,40187,40188,40189,40190,40191,40192,40193,40194,40195,40196,40197,40198,40199,40200,40201,40202,40203,40204,40205,40206,40207,40208,40209,40210,40211,40212,40213,40214,40215,40216,40217,40218,40219,40220,40221,40222,40223,40224,40225,0,40226,40227,40228,40229,40230,40231,40232,40233,40234,40235,40236,40237,40238,40239,40240,40241,40242,40243,40244,40245,40246,40247,40248,40249,40250,40251,40252,40253,40254,40255,40256,40257,40258,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40259,40260,40261,40262,40263,40264,40265,40266,40267,40268,40269,40270,40271,40272,40273,40274,40275,40276,40277,40278,40279,40280,40281,40282,40283,40284,40285,40286,40287,40288,40289,40290,40291,40292,40293,40294,40295,40296,40297,40298,40299,40300,40301,40302,40303,40304,40305,40306,40307,40308,40309,40310,40311,40312,40313,40314,40315,40316,40317,40318,40319,40320,40321,0,40322,40323,40324,40325,40326,40327,40328,40329,40330,40331,40332,40333,40334,40335,40336,40337,40338,40339,40340,40341,40342,40343,40344,40345,40346,40347,40348,40349,40350,40351,40352,40353,40354,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40355,40356,40357,40358,40359,40360,40361,40362,40363,40364,40365,40366,40367,40368,40369,40370,40371,40372,40373,40374,40375,40376,40377,40378,40379,40380,40381,40382,40383,40384,40385,40386,40387,40388,40389,40390,40391,40392,40393,40394,40395,40396,40397,40398,40399,40400,40401,40402,40403,40404,40405,40406,40407,40408,40409,40410,40411,40412,40413,40414,40415,40416,40417,0,40418,40419,40420,40421,40422,40423,40424,40425,40426,40427,40428,40429,40430,40431,40432,40433,40434,40435,40436,40437,40438,40439,40440,40441,40442,40443,40444,40445,40446,40447,40448,40449,40450,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40451,40452,40453,40454,40455,40456,40457,40458,40459,40460,40461,40462,40463,40464,40465,40466,40467,40468,40469,40470,40471,40472,40473,40474,40475,40476,40477,40478,40484,40487,40494,40496,40500,40507,40508,40512,40525,40528,40530,40531,40532,40534,40537,40541,40543,40544,40545,40546,40549,40558,40559,40562,40564,40565,40566,40567,40568,40569,40570,40571,40572,40573,40576,0,40577,40579,40580,40581,40582,40585,40586,40588,40589,40590,40591,40592,40593,40596,40597,40598,40599,40600,40601,40602,40603,40604,40606,40608,40609,40610,40611,40612,40613,40615,40616,40617,40618,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40619,40620,40621,40622,40623,40624,40625,40626,40627,40629,40630,40631,40633,40634,40636,40639,40640,40641,40642,40643,40645,40646,40647,40648,40650,40651,40652,40656,40658,40659,40661,40662,40663,40665,40666,40670,40673,40675,40676,40678,40680,40683,40684,40685,40686,40688,40689,40690,40691,40692,40693,40694,40695,40696,40698,40701,40703,40704,40705,40706,40707,40708,40709,0,40710,40711,40712,40713,40714,40716,40719,40721,40722,40724,40725,40726,40728,40730,40731,40732,40733,40734,40735,40737,40739,40740,40741,40742,40743,40744,40745,40746,40747,40749,40750,40752,40753,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,40754,40755,40756,40757,40758,40760,40762,40764,40767,40768,40769,40770,40771,40773,40774,40775,40776,40777,40778,40779,40780,40781,40782,40783,40786,40787,40788,40789,40790,40791,40792,40793,40794,40795,40796,40797,40798,40799,40800,40801,40802,40803,40804,40805,40806,40807,40808,40809,40810,40811,40812,40813,40814,40815,40816,40817,40818,40819,40820,40821,40822,40823,40824,0,40825,40826,40827,40828,40829,40830,40833,40834,40845,40846,40847,40848,40849,40850,40851,40852,40853,40854,40855,40856,40860,40861,40862,40865,40866,40867,40868,40869,63788,63865,63893,63975,63985,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64012,64013,64014,64015,64017,64019,64020,64024,64031,64032,64033,64035,64036,64039,64040,64041,59413,59414,59415,59416,59417,59418,59419,59420,59421,59422,59423,59424,59425,59426,59427,59428,59429,59430,59431,59432,59433,59434,59435,59436,59437,59438,59439,59440,59441,59442,59443,59444,59445,59446,59447,59448,59449,59450,59451,59452,59453,59454,59455,59456,59457,59458,59459,0,59460,59461,59462,59463,59464,59465,59466,59467,59468,59469,59470,59471,59472,59473,59474,59475,59476,59477,59478,59479,59480,59481,59482,59483,59484,59485,59486,59487,59488,59489,59490,59491,59492]');

/***/ }),

/***/ 374:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* global AudioBuffer */


var ADSR = __webpack_require__(137)

var EMPTY = {}
var DEFAULTS = {
  gain: 1,
  attack: 0.01,
  decay: 0.1,
  sustain: 0.9,
  release: 0.3,
  loop: false,
  cents: 0,
  loopStart: 0,
  loopEnd: 0
}

/**
 * Create a sample player.
 *
 * @param {AudioContext} ac - the audio context
 * @param {ArrayBuffer|Object<String,ArrayBuffer>} source
 * @param {Onject} options - (Optional) an options object
 * @return {player} the player
 * @example
 * var SamplePlayer = require('sample-player')
 * var ac = new AudioContext()
 * var snare = SamplePlayer(ac, <AudioBuffer>)
 * snare.play()
 */
function SamplePlayer (ac, source, options) {
  var connected = false
  var nextId = 0
  var tracked = {}
  var out = ac.createGain()
  out.gain.value = 1

  var opts = Object.assign({}, DEFAULTS, options)

  /**
   * @namespace
   */
  var player = { context: ac, out: out, opts: opts }
  if (source instanceof AudioBuffer) player.buffer = source
  else player.buffers = source

  /**
   * Start a sample buffer.
   *
   * The returned object has a function `stop(when)` to stop the sound.
   *
   * @param {String} name - the name of the buffer. If the source of the
   * SamplePlayer is one sample buffer, this parameter is not required
   * @param {Float} when - (Optional) when to start (current time if by default)
   * @param {Object} options - additional sample playing options
   * @return {AudioNode} an audio node with a `stop` function
   * @example
   * var sample = player(ac, <AudioBuffer>).connect(ac.destination)
   * sample.start()
   * sample.start(5, { gain: 0.7 }) // name not required since is only one AudioBuffer
   * @example
   * var drums = player(ac, { snare: <AudioBuffer>, kick: <AudioBuffer>, ... }).connect(ac.destination)
   * drums.start('snare')
   * drums.start('snare', 0, { gain: 0.3 })
   */
  player.start = function (name, when, options) {
    // if only one buffer, reorder arguments
    if (player.buffer && name !== null) return player.start(null, name, when)

    var buffer = name ? player.buffers[name] : player.buffer
    if (!buffer) {
      console.warn('Buffer ' + name + ' not found.')
      return
    } else if (!connected) {
      console.warn('SamplePlayer not connected to any node.')
      return
    }

    var opts = options || EMPTY
    when = Math.max(ac.currentTime, when || 0)
    player.emit('start', when, name, opts)
    var node = createNode(name, buffer, opts)
    node.id = track(name, node)
    node.env.start(when)
    node.source.start(when)
    player.emit('started', when, node.id, node)
    if (opts.duration) node.stop(when + opts.duration)
    return node
  }

  // NOTE: start will be override so we can't copy the function reference
  // this is obviously not a good design, so this code will be gone soon.
  /**
   * An alias for `player.start`
   * @see player.start
   * @since 0.3.0
   */
  player.play = function (name, when, options) {
    return player.start(name, when, options)
  }

  /**
   * Stop some or all samples
   *
   * @param {Float} when - (Optional) an absolute time in seconds (or currentTime
   * if not specified)
   * @param {Array} nodes - (Optional) an array of nodes or nodes ids to stop
   * @return {Array} an array of ids of the stoped samples
   *
   * @example
   * var longSound = player(ac, <AudioBuffer>).connect(ac.destination)
   * longSound.start(ac.currentTime)
   * longSound.start(ac.currentTime + 1)
   * longSound.start(ac.currentTime + 2)
   * longSound.stop(ac.currentTime + 3) // stop the three sounds
   */
  player.stop = function (when, ids) {
    var node
    ids = ids || Object.keys(tracked)
    return ids.map(function (id) {
      node = tracked[id]
      if (!node) return null
      node.stop(when)
      return node.id
    })
  }
  /**
   * Connect the player to a destination node
   *
   * @param {AudioNode} destination - the destination node
   * @return {AudioPlayer} the player
   * @chainable
   * @example
   * var sample = player(ac, <AudioBuffer>).connect(ac.destination)
   */
  player.connect = function (dest) {
    connected = true
    out.connect(dest)
    return player
  }

  player.emit = function (event, when, obj, opts) {
    if (player.onevent) player.onevent(event, when, obj, opts)
    var fn = player['on' + event]
    if (fn) fn(when, obj, opts)
  }

  return player

  // =============== PRIVATE FUNCTIONS ============== //

  function track (name, node) {
    node.id = nextId++
    tracked[node.id] = node
    node.source.onended = function () {
      var now = ac.currentTime
      node.source.disconnect()
      node.env.disconnect()
      node.disconnect()
      player.emit('ended', now, node.id, node)
    }
    return node.id
  }

  function createNode (name, buffer, options) {
    var node = ac.createGain()
    node.gain.value = 0 // the envelope will control the gain
    node.connect(out)

    node.env = envelope(ac, options, opts)
    node.env.connect(node.gain)

    node.source = ac.createBufferSource()
    node.source.buffer = buffer
    node.source.connect(node)
    node.source.loop = options.loop || opts.loop
    node.source.playbackRate.value = centsToRate(options.cents || opts.cents)
    node.source.loopStart = options.loopStart || opts.loopStart
    node.source.loopEnd = options.loopEnd || opts.loopEnd
    node.stop = function (when) {
      var time = when || ac.currentTime
      player.emit('stop', time, name)
      var stopAt = node.env.stop(time)
      node.source.stop(stopAt)
    }
    return node
  }
}

function isNum (x) { return typeof x === 'number' }
var PARAMS = ['attack', 'decay', 'sustain', 'release']
function envelope (ac, options, opts) {
  var env = ADSR(ac)
  var adsr = options.adsr || opts.adsr
  PARAMS.forEach(function (name, i) {
    if (adsr) env[name] = adsr[i]
    else env[name] = options[name] || opts[name]
  })
  env.value.value = isNum(options.gain) ? options.gain
    : isNum(opts.gain) ? opts.gain : 1
  return env
}

/*
 * Get playback rate for a given pitch change (in cents)
 * Basic [math](http://www.birdsoft.demon.co.uk/music/samplert.htm):
 * f2 = f1 * 2^( C / 1200 )
 */
function centsToRate (cents) { return cents ? Math.pow(2, cents / 1200) : 1 }

module.exports = SamplePlayer


/***/ }),

/***/ 387:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var player = __webpack_require__(374)
var events = __webpack_require__(778)
var notes = __webpack_require__(30)
var scheduler = __webpack_require__(174)
var midi = __webpack_require__(202)

function SamplePlayer (ac, source, options) {
  return midi(scheduler(notes(events(player(ac, source, options)))))
}

if ( true && module.exports) module.exports = SamplePlayer
if (typeof window !== 'undefined') window.SamplePlayer = SamplePlayer


/***/ }),

/***/ 411:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = __webpack_require__(665);
const adler32 = __webpack_require__(269);
const crc32   = __webpack_require__(823);
const msg     = __webpack_require__(674);

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_NO_FLUSH, Z_PARTIAL_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_BLOCK,
  Z_OK, Z_STREAM_END, Z_STREAM_ERROR, Z_DATA_ERROR, Z_BUF_ERROR,
  Z_DEFAULT_COMPRESSION,
  Z_FILTERED, Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY,
  Z_UNKNOWN,
  Z_DEFLATED
} = __webpack_require__(681);

/*============================================================================*/


const MAX_MEM_LEVEL = 9;
/* Maximum value for memLevel in deflateInit2 */
const MAX_WBITS = 15;
/* 32K LZ77 window */
const DEF_MEM_LEVEL = 8;


const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */
const LITERALS      = 256;
/* number of literal bytes 0..255 */
const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */
const D_CODES       = 30;
/* number of distance codes */
const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */
const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */
const MAX_BITS  = 15;
/* All codes must not exceed MAX_BITS bits */

const MIN_MATCH = 3;
const MAX_MATCH = 258;
const MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);

const PRESET_DICT = 0x20;

const INIT_STATE    =  42;    /* zlib header -> BUSY_STATE */
//#ifdef GZIP
const GZIP_STATE    =  57;    /* gzip header -> BUSY_STATE | EXTRA_STATE */
//#endif
const EXTRA_STATE   =  69;    /* gzip extra block -> NAME_STATE */
const NAME_STATE    =  73;    /* gzip file name -> COMMENT_STATE */
const COMMENT_STATE =  91;    /* gzip comment -> HCRC_STATE */
const HCRC_STATE    = 103;    /* gzip header CRC -> BUSY_STATE */
const BUSY_STATE    = 113;    /* deflate -> FINISH_STATE */
const FINISH_STATE  = 666;    /* stream complete */

const BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
const BS_BLOCK_DONE     = 2; /* block flush performed */
const BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
const BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */

const OS_CODE = 0x03; // Unix :) . Don't detect, use this default.

const err = (strm, errorCode) => {
  strm.msg = msg[errorCode];
  return errorCode;
};

const rank = (f) => {
  return ((f) * 2) - ((f) > 4 ? 9 : 0);
};

const zero = (buf) => {
  let len = buf.length; while (--len >= 0) { buf[len] = 0; }
};

/* ===========================================================================
 * Slide the hash table when sliding the window down (could be avoided with 32
 * bit values at the expense of memory usage). We slide even when level == 0 to
 * keep the hash table consistent if we switch back to level > 0 later.
 */
const slide_hash = (s) => {
  let n, m;
  let p;
  let wsize = s.w_size;

  n = s.hash_size;
  p = n;
  do {
    m = s.head[--p];
    s.head[p] = (m >= wsize ? m - wsize : 0);
  } while (--n);
  n = wsize;
//#ifndef FASTEST
  p = n;
  do {
    m = s.prev[--p];
    s.prev[p] = (m >= wsize ? m - wsize : 0);
    /* If n is not on any hash chain, prev[n] is garbage but
     * its value will never be used.
     */
  } while (--n);
//#endif
};

/* eslint-disable new-cap */
let HASH_ZLIB = (s, prev, data) => ((prev << s.hash_shift) ^ data) & s.hash_mask;
// This hash causes less collisions, https://github.com/nodeca/pako/issues/135
// But breaks binary compatibility
//let HASH_FAST = (s, prev, data) => ((prev << 8) + (prev >> 8) + (data << 4)) & s.hash_mask;
let HASH = HASH_ZLIB;


/* =========================================================================
 * Flush as much pending output as possible. All deflate() output, except for
 * some deflate_stored() output, goes through this function so some
 * applications may wish to modify it to avoid allocating a large
 * strm->next_out buffer and copying into it. (See also read_buf()).
 */
const flush_pending = (strm) => {
  const s = strm.state;

  //_tr_flush_bits(s);
  let len = s.pending;
  if (len > strm.avail_out) {
    len = strm.avail_out;
  }
  if (len === 0) { return; }

  strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
  strm.next_out  += len;
  s.pending_out  += len;
  strm.total_out += len;
  strm.avail_out -= len;
  s.pending      -= len;
  if (s.pending === 0) {
    s.pending_out = 0;
  }
};


const flush_block_only = (s, last) => {
  _tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
  s.block_start = s.strstart;
  flush_pending(s.strm);
};


const put_byte = (s, b) => {
  s.pending_buf[s.pending++] = b;
};


/* =========================================================================
 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
 * IN assertion: the stream state is correct and there is enough room in
 * pending_buf.
 */
const putShortMSB = (s, b) => {

  //  put_byte(s, (Byte)(b >> 8));
//  put_byte(s, (Byte)(b & 0xff));
  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
  s.pending_buf[s.pending++] = b & 0xff;
};


/* ===========================================================================
 * Read a new buffer from the current input stream, update the adler32
 * and total number of bytes read.  All deflate() input goes through
 * this function so some applications may wish to modify it to avoid
 * allocating a large strm->input buffer and copying from it.
 * (See also flush_pending()).
 */
const read_buf = (strm, buf, start, size) => {

  let len = strm.avail_in;

  if (len > size) { len = size; }
  if (len === 0) { return 0; }

  strm.avail_in -= len;

  // zmemcpy(buf, strm->next_in, len);
  buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
  if (strm.state.wrap === 1) {
    strm.adler = adler32(strm.adler, buf, len, start);
  }

  else if (strm.state.wrap === 2) {
    strm.adler = crc32(strm.adler, buf, len, start);
  }

  strm.next_in += len;
  strm.total_in += len;

  return len;
};


/* ===========================================================================
 * Set match_start to the longest match starting at the given string and
 * return its length. Matches shorter or equal to prev_length are discarded,
 * in which case the result is equal to prev_length and match_start is
 * garbage.
 * IN assertions: cur_match is the head of the hash chain for the current
 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
 * OUT assertion: the match length is not greater than s->lookahead.
 */
const longest_match = (s, cur_match) => {

  let chain_length = s.max_chain_length;      /* max hash chain length */
  let scan = s.strstart; /* current string */
  let match;                       /* matched string */
  let len;                           /* length of current match */
  let best_len = s.prev_length;              /* best match length so far */
  let nice_match = s.nice_match;             /* stop if match long enough */
  const limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;

  const _win = s.window; // shortcut

  const wmask = s.w_mask;
  const prev  = s.prev;

  /* Stop when cur_match becomes <= limit. To simplify the code,
   * we prevent matches with the string of window index 0.
   */

  const strend = s.strstart + MAX_MATCH;
  let scan_end1  = _win[scan + best_len - 1];
  let scan_end   = _win[scan + best_len];

  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
   * It is easy to get rid of this optimization if necessary.
   */
  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");

  /* Do not waste too much time if we already have a good match: */
  if (s.prev_length >= s.good_match) {
    chain_length >>= 2;
  }
  /* Do not look for matches beyond the end of the input. This is necessary
   * to make deflate deterministic.
   */
  if (nice_match > s.lookahead) { nice_match = s.lookahead; }

  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");

  do {
    // Assert(cur_match < s->strstart, "no future");
    match = cur_match;

    /* Skip to next match if the match length cannot increase
     * or if the match length is less than 2.  Note that the checks below
     * for insufficient lookahead only occur occasionally for performance
     * reasons.  Therefore uninitialized memory will be accessed, and
     * conditional jumps will be made that depend on those values.
     * However the length of the match is limited to the lookahead, so
     * the output of deflate is not affected by the uninitialized values.
     */

    if (_win[match + best_len]     !== scan_end  ||
        _win[match + best_len - 1] !== scan_end1 ||
        _win[match]                !== _win[scan] ||
        _win[++match]              !== _win[scan + 1]) {
      continue;
    }

    /* The check at best_len-1 can be removed because it will be made
     * again later. (This heuristic is not always a win.)
     * It is not necessary to compare scan[2] and match[2] since they
     * are always equal when the other bytes match, given that
     * the hash keys are equal and that HASH_BITS >= 8.
     */
    scan += 2;
    match++;
    // Assert(*scan == *match, "match[2]?");

    /* We check for insufficient lookahead only every 8th comparison;
     * the 256th check will be made at strstart+258.
     */
    do {
      /*jshint noempty:false*/
    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
             scan < strend);

    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");

    len = MAX_MATCH - (strend - scan);
    scan = strend - MAX_MATCH;

    if (len > best_len) {
      s.match_start = cur_match;
      best_len = len;
      if (len >= nice_match) {
        break;
      }
      scan_end1  = _win[scan + best_len - 1];
      scan_end   = _win[scan + best_len];
    }
  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);

  if (best_len <= s.lookahead) {
    return best_len;
  }
  return s.lookahead;
};


/* ===========================================================================
 * Fill the window when the lookahead becomes insufficient.
 * Updates strstart and lookahead.
 *
 * IN assertion: lookahead < MIN_LOOKAHEAD
 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
 *    At least one byte has been read, or avail_in == 0; reads are
 *    performed for at least two bytes (required for the zip translate_eol
 *    option -- not supported here).
 */
const fill_window = (s) => {

  const _w_size = s.w_size;
  let n, more, str;

  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");

  do {
    more = s.window_size - s.lookahead - s.strstart;

    // JS ints have 32 bit, block below not needed
    /* Deal with !@#$% 64K limit: */
    //if (sizeof(int) <= 2) {
    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
    //        more = wsize;
    //
    //  } else if (more == (unsigned)(-1)) {
    //        /* Very unlikely, but possible on 16 bit machine if
    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
    //         */
    //        more--;
    //    }
    //}


    /* If the window is almost full and there is insufficient lookahead,
     * move the upper half to the lower one to make room in the upper half.
     */
    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {

      s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
      s.match_start -= _w_size;
      s.strstart -= _w_size;
      /* we now have strstart >= MAX_DIST */
      s.block_start -= _w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
      slide_hash(s);
      more += _w_size;
    }
    if (s.strm.avail_in === 0) {
      break;
    }

    /* If there was no sliding:
     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
     *    more == window_size - lookahead - strstart
     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
     * => more >= window_size - 2*WSIZE + 2
     * In the BIG_MEM or MMAP case (not yet supported),
     *   window_size == input_size + MIN_LOOKAHEAD  &&
     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
     * Otherwise, window_size == 2*WSIZE so more >= 2.
     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
     */
    //Assert(more >= 2, "more < 2");
    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
    s.lookahead += n;

    /* Initialize the hash value now that we have some input: */
    if (s.lookahead + s.insert >= MIN_MATCH) {
      str = s.strstart - s.insert;
      s.ins_h = s.window[str];

      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
//#if MIN_MATCH != 3
//        Call update_hash() MIN_MATCH-3 more times
//#endif
      while (s.insert) {
        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
        s.insert--;
        if (s.lookahead + s.insert < MIN_MATCH) {
          break;
        }
      }
    }
    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
     * but this is not important since only literal bytes will be emitted.
     */

  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);

  /* If the WIN_INIT bytes after the end of the current data have never been
   * written, then zero those bytes in order to avoid memory check reports of
   * the use of uninitialized (or uninitialised as Julian writes) bytes by
   * the longest match routines.  Update the high water mark for the next
   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
   */
//  if (s.high_water < s.window_size) {
//    const curr = s.strstart + s.lookahead;
//    let init = 0;
//
//    if (s.high_water < curr) {
//      /* Previous high water mark below current data -- zero WIN_INIT
//       * bytes or up to end of window, whichever is less.
//       */
//      init = s.window_size - curr;
//      if (init > WIN_INIT)
//        init = WIN_INIT;
//      zmemzero(s->window + curr, (unsigned)init);
//      s->high_water = curr + init;
//    }
//    else if (s->high_water < (ulg)curr + WIN_INIT) {
//      /* High water mark at or above current data, but below current data
//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
//       * to end of window, whichever is less.
//       */
//      init = (ulg)curr + WIN_INIT - s->high_water;
//      if (init > s->window_size - s->high_water)
//        init = s->window_size - s->high_water;
//      zmemzero(s->window + s->high_water, (unsigned)init);
//      s->high_water += init;
//    }
//  }
//
//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
//    "not enough room for search");
};

/* ===========================================================================
 * Copy without compression as much as possible from the input stream, return
 * the current block state.
 *
 * In case deflateParams() is used to later switch to a non-zero compression
 * level, s->matches (otherwise unused when storing) keeps track of the number
 * of hash table slides to perform. If s->matches is 1, then one hash table
 * slide will be done when switching. If s->matches is 2, the maximum value
 * allowed here, then the hash table will be cleared, since two or more slides
 * is the same as a clear.
 *
 * deflate_stored() is written to minimize the number of times an input byte is
 * copied. It is most efficient with large input and output buffers, which
 * maximizes the opportunites to have a single copy from next_in to next_out.
 */
const deflate_stored = (s, flush) => {

  /* Smallest worthy block size when not flushing or finishing. By default
   * this is 32K. This can be as small as 507 bytes for memLevel == 1. For
   * large input and output buffers, the stored block size will be larger.
   */
  let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;

  /* Copy as many min_block or larger stored blocks directly to next_out as
   * possible. If flushing, copy the remaining available input to next_out as
   * stored blocks, if there is enough space.
   */
  let len, left, have, last = 0;
  let used = s.strm.avail_in;
  do {
    /* Set len to the maximum size block that we can copy directly with the
     * available input data and output space. Set left to how much of that
     * would be copied from what's left in the window.
     */
    len = 65535/* MAX_STORED */;     /* maximum deflate stored block length */
    have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    if (s.strm.avail_out < have) {         /* need room for header */
      break;
    }
      /* maximum stored block length that will fit in avail_out: */
    have = s.strm.avail_out - have;
    left = s.strstart - s.block_start;  /* bytes left in window */
    if (len > left + s.strm.avail_in) {
      len = left + s.strm.avail_in;   /* limit len to the input */
    }
    if (len > have) {
      len = have;             /* limit len to the output */
    }

    /* If the stored block would be less than min_block in length, or if
     * unable to copy all of the available input when flushing, then try
     * copying to the window and the pending buffer instead. Also don't
     * write an empty block when flushing -- deflate() does that.
     */
    if (len < min_block && ((len === 0 && flush !== Z_FINISH) ||
                        flush === Z_NO_FLUSH ||
                        len !== left + s.strm.avail_in)) {
      break;
    }

    /* Make a dummy stored block in pending to get the header bytes,
     * including any pending bits. This also updates the debugging counts.
     */
    last = flush === Z_FINISH && len === left + s.strm.avail_in ? 1 : 0;
    _tr_stored_block(s, 0, 0, last);

    /* Replace the lengths in the dummy stored block with len. */
    s.pending_buf[s.pending - 4] = len;
    s.pending_buf[s.pending - 3] = len >> 8;
    s.pending_buf[s.pending - 2] = ~len;
    s.pending_buf[s.pending - 1] = ~len >> 8;

    /* Write the stored block header bytes. */
    flush_pending(s.strm);

//#ifdef ZLIB_DEBUG
//    /* Update debugging counts for the data about to be copied. */
//    s->compressed_len += len << 3;
//    s->bits_sent += len << 3;
//#endif

    /* Copy uncompressed bytes from the window to next_out. */
    if (left) {
      if (left > len) {
        left = len;
      }
      //zmemcpy(s->strm->next_out, s->window + s->block_start, left);
      s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
      s.strm.next_out += left;
      s.strm.avail_out -= left;
      s.strm.total_out += left;
      s.block_start += left;
      len -= left;
    }

    /* Copy uncompressed bytes directly from next_in to next_out, updating
     * the check value.
     */
    if (len) {
      read_buf(s.strm, s.strm.output, s.strm.next_out, len);
      s.strm.next_out += len;
      s.strm.avail_out -= len;
      s.strm.total_out += len;
    }
  } while (last === 0);

  /* Update the sliding window with the last s->w_size bytes of the copied
   * data, or append all of the copied data to the existing window if less
   * than s->w_size bytes were copied. Also update the number of bytes to
   * insert in the hash tables, in the event that deflateParams() switches to
   * a non-zero compression level.
   */
  used -= s.strm.avail_in;    /* number of input bytes directly copied */
  if (used) {
    /* If any input was used, then no unused input remains in the window,
     * therefore s->block_start == s->strstart.
     */
    if (used >= s.w_size) {  /* supplant the previous history */
      s.matches = 2;     /* clear hash */
      //zmemcpy(s->window, s->strm->next_in - s->w_size, s->w_size);
      s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
      s.strstart = s.w_size;
      s.insert = s.strstart;
    }
    else {
      if (s.window_size - s.strstart <= used) {
        /* Slide the window down. */
        s.strstart -= s.w_size;
        //zmemcpy(s->window, s->window + s->w_size, s->strstart);
        s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
        if (s.matches < 2) {
          s.matches++;   /* add a pending slide_hash() */
        }
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
      }
      //zmemcpy(s->window + s->strstart, s->strm->next_in - used, used);
      s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
      s.strstart += used;
      s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
    }
    s.block_start = s.strstart;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* If the last block was written to next_out, then done. */
  if (last) {
    return BS_FINISH_DONE;
  }

  /* If flushing and all input has been consumed, then done. */
  if (flush !== Z_NO_FLUSH && flush !== Z_FINISH &&
    s.strm.avail_in === 0 && s.strstart === s.block_start) {
    return BS_BLOCK_DONE;
  }

  /* Fill the window with any remaining input. */
  have = s.window_size - s.strstart;
  if (s.strm.avail_in > have && s.block_start >= s.w_size) {
    /* Slide the window down. */
    s.block_start -= s.w_size;
    s.strstart -= s.w_size;
    //zmemcpy(s->window, s->window + s->w_size, s->strstart);
    s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
    if (s.matches < 2) {
      s.matches++;       /* add a pending slide_hash() */
    }
    have += s.w_size;      /* more space now */
    if (s.insert > s.strstart) {
      s.insert = s.strstart;
    }
  }
  if (have > s.strm.avail_in) {
    have = s.strm.avail_in;
  }
  if (have) {
    read_buf(s.strm, s.window, s.strstart, have);
    s.strstart += have;
    s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
  }
  if (s.high_water < s.strstart) {
    s.high_water = s.strstart;
  }

  /* There was not enough avail_out to write a complete worthy or flushed
   * stored block to next_out. Write a stored block to pending instead, if we
   * have enough input for a worthy block, or if flushing and there is enough
   * room for the remaining input as a stored block in the pending buffer.
   */
  have = (s.bi_valid + 42) >> 3;     /* number of header bytes */
    /* maximum stored block length that will fit in pending: */
  have = s.pending_buf_size - have > 65535/* MAX_STORED */ ? 65535/* MAX_STORED */ : s.pending_buf_size - have;
  min_block = have > s.w_size ? s.w_size : have;
  left = s.strstart - s.block_start;
  if (left >= min_block ||
     ((left || flush === Z_FINISH) && flush !== Z_NO_FLUSH &&
     s.strm.avail_in === 0 && left <= have)) {
    len = left > have ? have : left;
    last = flush === Z_FINISH && s.strm.avail_in === 0 &&
         len === left ? 1 : 0;
    _tr_stored_block(s, s.block_start, len, last);
    s.block_start += len;
    flush_pending(s.strm);
  }

  /* We've done all we can with the available input and output. */
  return last ? BS_FINISH_STARTED : BS_NEED_MORE;
};


/* ===========================================================================
 * Compress as much as possible from the input stream, return the current
 * block state.
 * This function does not perform lazy evaluation of matches and inserts
 * new strings in the dictionary only for unmatched strings or for short
 * matches. It is used only for the fast compression options.
 */
const deflate_fast = (s, flush) => {

  let hash_head;        /* head of the hash chain */
  let bflush;           /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) {
        break; /* flush the current block */
      }
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     * At this point we have always match_length < MIN_MATCH
     */
    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */
    }
    if (s.match_length >= MIN_MATCH) {
      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only

      /*** _tr_tally_dist(s, s.strstart - s.match_start,
                     s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;

      /* Insert new strings in the hash table only if the match length
       * is not too large. This saves time but degrades compression.
       */
      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
        s.match_length--; /* string at strstart already in table */
        do {
          s.strstart++;
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
           * always MIN_MATCH bytes ahead.
           */
        } while (--s.match_length !== 0);
        s.strstart++;
      } else
      {
        s.strstart += s.match_length;
        s.match_length = 0;
        s.ins_h = s.window[s.strstart];
        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);

//#if MIN_MATCH != 3
//                Call UPDATE_HASH() MIN_MATCH-3 more times
//#endif
        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
         * matter since it will be recomputed at next deflate call.
         */
      }
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s.window[s.strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * Same as above, but achieves better compression. We use a lazy
 * evaluation for matches: a match is finally adopted only if there is
 * no better match at the next window position.
 */
const deflate_slow = (s, flush) => {

  let hash_head;          /* head of hash chain */
  let bflush;              /* set if current block must be flushed */

  let max_insert;

  /* Process the input block. */
  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the next match, plus MIN_MATCH bytes to insert the
     * string following the next match.
     */
    if (s.lookahead < MIN_LOOKAHEAD) {
      fill_window(s);
      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* Insert the string window[strstart .. strstart+2] in the
     * dictionary, and set hash_head to the head of the hash chain:
     */
    hash_head = 0/*NIL*/;
    if (s.lookahead >= MIN_MATCH) {
      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
      s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
      s.head[s.ins_h] = s.strstart;
      /***/
    }

    /* Find the longest match, discarding those <= prev_length.
     */
    s.prev_length = s.match_length;
    s.prev_match = s.match_start;
    s.match_length = MIN_MATCH - 1;

    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
      /* To simplify the code, we prevent matches with the string
       * of window index 0 (in particular we have to avoid a match
       * of the string with itself at the start of the input file).
       */
      s.match_length = longest_match(s, hash_head);
      /* longest_match() sets match_start */

      if (s.match_length <= 5 &&
         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {

        /* If prev_match is also MIN_MATCH, match_start is garbage
         * but we will ignore the current match anyway.
         */
        s.match_length = MIN_MATCH - 1;
      }
    }
    /* If there was a match at the previous step and the current
     * match is not better, output the previous match:
     */
    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
      max_insert = s.strstart + s.lookahead - MIN_MATCH;
      /* Do not insert strings in hash table beyond this. */

      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);

      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
                     s.prev_length - MIN_MATCH, bflush);***/
      bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
      /* Insert in hash table all strings up to the end of the match.
       * strstart-1 and strstart are already inserted. If there is not
       * enough lookahead, the last two strings are not inserted in
       * the hash table.
       */
      s.lookahead -= s.prev_length - 1;
      s.prev_length -= 2;
      do {
        if (++s.strstart <= max_insert) {
          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = s.strstart;
          /***/
        }
      } while (--s.prev_length !== 0);
      s.match_available = 0;
      s.match_length = MIN_MATCH - 1;
      s.strstart++;

      if (bflush) {
        /*** FLUSH_BLOCK(s, 0); ***/
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
        /***/
      }

    } else if (s.match_available) {
      /* If there was no match at the previous position, output a
       * single literal. If there was a match but the current match
       * is longer, truncate the previous match to a single literal.
       */
      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

      if (bflush) {
        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
        flush_block_only(s, false);
        /***/
      }
      s.strstart++;
      s.lookahead--;
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    } else {
      /* There is no previous match to compare with, wait for
       * the next step to decide.
       */
      s.match_available = 1;
      s.strstart++;
      s.lookahead--;
    }
  }
  //Assert (flush != Z_NO_FLUSH, "no flush?");
  if (s.match_available) {
    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);

    s.match_available = 0;
  }
  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }

  return BS_BLOCK_DONE;
};


/* ===========================================================================
 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
 * deflate switches away from Z_RLE.)
 */
const deflate_rle = (s, flush) => {

  let bflush;            /* set if current block must be flushed */
  let prev;              /* byte at distance one to match */
  let scan, strend;      /* scan goes up to strend for length of run */

  const _win = s.window;

  for (;;) {
    /* Make sure that we always have enough lookahead, except
     * at the end of the input file. We need MAX_MATCH bytes
     * for the longest run, plus one for the unrolled loop.
     */
    if (s.lookahead <= MAX_MATCH) {
      fill_window(s);
      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
        return BS_NEED_MORE;
      }
      if (s.lookahead === 0) { break; } /* flush the current block */
    }

    /* See how many times the previous byte repeats */
    s.match_length = 0;
    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
      scan = s.strstart - 1;
      prev = _win[scan];
      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
        strend = s.strstart + MAX_MATCH;
        do {
          /*jshint noempty:false*/
        } while (prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 prev === _win[++scan] && prev === _win[++scan] &&
                 scan < strend);
        s.match_length = MAX_MATCH - (strend - scan);
        if (s.match_length > s.lookahead) {
          s.match_length = s.lookahead;
        }
      }
      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
    }

    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
    if (s.match_length >= MIN_MATCH) {
      //check_match(s, s.strstart, s.strstart - 1, s.match_length);

      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
      bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);

      s.lookahead -= s.match_length;
      s.strstart += s.match_length;
      s.match_length = 0;
    } else {
      /* No match, output a literal byte */
      //Tracevv((stderr,"%c", s->window[s->strstart]));
      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
      bflush = _tr_tally(s, 0, s.window[s.strstart]);

      s.lookahead--;
      s.strstart++;
    }
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* ===========================================================================
 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
 * (It will be regenerated if this run of deflate switches away from Huffman.)
 */
const deflate_huff = (s, flush) => {

  let bflush;             /* set if current block must be flushed */

  for (;;) {
    /* Make sure that we have a literal to write. */
    if (s.lookahead === 0) {
      fill_window(s);
      if (s.lookahead === 0) {
        if (flush === Z_NO_FLUSH) {
          return BS_NEED_MORE;
        }
        break;      /* flush the current block */
      }
    }

    /* Output a literal byte */
    s.match_length = 0;
    //Tracevv((stderr,"%c", s->window[s->strstart]));
    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
    bflush = _tr_tally(s, 0, s.window[s.strstart]);
    s.lookahead--;
    s.strstart++;
    if (bflush) {
      /*** FLUSH_BLOCK(s, 0); ***/
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
      /***/
    }
  }
  s.insert = 0;
  if (flush === Z_FINISH) {
    /*** FLUSH_BLOCK(s, 1); ***/
    flush_block_only(s, true);
    if (s.strm.avail_out === 0) {
      return BS_FINISH_STARTED;
    }
    /***/
    return BS_FINISH_DONE;
  }
  if (s.sym_next) {
    /*** FLUSH_BLOCK(s, 0); ***/
    flush_block_only(s, false);
    if (s.strm.avail_out === 0) {
      return BS_NEED_MORE;
    }
    /***/
  }
  return BS_BLOCK_DONE;
};

/* Values for max_lazy_match, good_match and max_chain_length, depending on
 * the desired pack level (0..9). The values given below have been tuned to
 * exclude worst case performance for pathological files. Better values may be
 * found for specific files.
 */
function Config(good_length, max_lazy, nice_length, max_chain, func) {

  this.good_length = good_length;
  this.max_lazy = max_lazy;
  this.nice_length = nice_length;
  this.max_chain = max_chain;
  this.func = func;
}

const configuration_table = [
  /*      good lazy nice chain */
  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */

  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
];


/* ===========================================================================
 * Initialize the "longest match" routines for a new zlib stream
 */
const lm_init = (s) => {

  s.window_size = 2 * s.w_size;

  /*** CLEAR_HASH(s); ***/
  zero(s.head); // Fill with NIL (= 0);

  /* Set the default configuration parameters:
   */
  s.max_lazy_match = configuration_table[s.level].max_lazy;
  s.good_match = configuration_table[s.level].good_length;
  s.nice_match = configuration_table[s.level].nice_length;
  s.max_chain_length = configuration_table[s.level].max_chain;

  s.strstart = 0;
  s.block_start = 0;
  s.lookahead = 0;
  s.insert = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  s.ins_h = 0;
};


function DeflateState() {
  this.strm = null;            /* pointer back to this zlib stream */
  this.status = 0;            /* as the name implies */
  this.pending_buf = null;      /* output still pending */
  this.pending_buf_size = 0;  /* size of pending_buf */
  this.pending_out = 0;       /* next pending byte to output to the stream */
  this.pending = 0;           /* nb of bytes in the pending buffer */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
  this.gzhead = null;         /* gzip header information to write */
  this.gzindex = 0;           /* where in extra, name, or comment */
  this.method = Z_DEFLATED; /* can only be DEFLATED */
  this.last_flush = -1;   /* value of flush param for previous deflate call */

  this.w_size = 0;  /* LZ77 window size (32K by default) */
  this.w_bits = 0;  /* log2(w_size)  (8..16) */
  this.w_mask = 0;  /* w_size - 1 */

  this.window = null;
  /* Sliding window. Input bytes are read into the second half of the window,
   * and move to the first half later to keep a dictionary of at least wSize
   * bytes. With this organization, matches are limited to a distance of
   * wSize-MAX_MATCH bytes, but this ensures that IO is always
   * performed with a length multiple of the block size.
   */

  this.window_size = 0;
  /* Actual size of window: 2*wSize, except when the user input buffer
   * is directly used as sliding window.
   */

  this.prev = null;
  /* Link to older string with same hash index. To limit the size of this
   * array to 64K, this link is maintained only for the last 32K strings.
   * An index in this array is thus a window index modulo 32K.
   */

  this.head = null;   /* Heads of the hash chains or NIL. */

  this.ins_h = 0;       /* hash index of string to be inserted */
  this.hash_size = 0;   /* number of elements in hash table */
  this.hash_bits = 0;   /* log2(hash_size) */
  this.hash_mask = 0;   /* hash_size-1 */

  this.hash_shift = 0;
  /* Number of bits by which ins_h must be shifted at each input
   * step. It must be such that after MIN_MATCH steps, the oldest
   * byte no longer takes part in the hash key, that is:
   *   hash_shift * MIN_MATCH >= hash_bits
   */

  this.block_start = 0;
  /* Window position at the beginning of the current output block. Gets
   * negative when the window is moved backwards.
   */

  this.match_length = 0;      /* length of best match */
  this.prev_match = 0;        /* previous match */
  this.match_available = 0;   /* set if previous match exists */
  this.strstart = 0;          /* start of string to insert */
  this.match_start = 0;       /* start of matching string */
  this.lookahead = 0;         /* number of valid bytes ahead in window */

  this.prev_length = 0;
  /* Length of the best match at previous step. Matches not greater than this
   * are discarded. This is used in the lazy match evaluation.
   */

  this.max_chain_length = 0;
  /* To speed up deflation, hash chains are never searched beyond this
   * length.  A higher limit improves compression ratio but degrades the
   * speed.
   */

  this.max_lazy_match = 0;
  /* Attempt to find a better match only when the current match is strictly
   * smaller than this value. This mechanism is used only for compression
   * levels >= 4.
   */
  // That's alias to max_lazy_match, don't use directly
  //this.max_insert_length = 0;
  /* Insert new strings in the hash table only if the match length is not
   * greater than this length. This saves time but degrades compression.
   * max_insert_length is used only for compression levels <= 3.
   */

  this.level = 0;     /* compression level (1..9) */
  this.strategy = 0;  /* favor or force Huffman coding*/

  this.good_match = 0;
  /* Use a faster search when the previous match is longer than this */

  this.nice_match = 0; /* Stop searching when current match exceeds this */

              /* used by trees.c: */

  /* Didn't use ct_data typedef below to suppress compiler warning */

  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */

  // Use flat array of DOUBLE size, with interleaved fata,
  // because JS does not support effective
  this.dyn_ltree  = new Uint16Array(HEAP_SIZE * 2);
  this.dyn_dtree  = new Uint16Array((2 * D_CODES + 1) * 2);
  this.bl_tree    = new Uint16Array((2 * BL_CODES + 1) * 2);
  zero(this.dyn_ltree);
  zero(this.dyn_dtree);
  zero(this.bl_tree);

  this.l_desc   = null;         /* desc. for literal tree */
  this.d_desc   = null;         /* desc. for distance tree */
  this.bl_desc  = null;         /* desc. for bit length tree */

  //ush bl_count[MAX_BITS+1];
  this.bl_count = new Uint16Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
  this.heap = new Uint16Array(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
  zero(this.heap);

  this.heap_len = 0;               /* number of elements in the heap */
  this.heap_max = 0;               /* element of largest frequency */
  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
   * The same heap array is used to build all trees.
   */

  this.depth = new Uint16Array(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
  zero(this.depth);
  /* Depth of each subtree used as tie breaker for trees of equal frequency
   */

  this.sym_buf = 0;        /* buffer for distances and literals/lengths */

  this.lit_bufsize = 0;
  /* Size of match buffer for literals/lengths.  There are 4 reasons for
   * limiting lit_bufsize to 64K:
   *   - frequencies can be kept in 16 bit counters
   *   - if compression is not successful for the first block, all input
   *     data is still in the window so we can still emit a stored block even
   *     when input comes from standard input.  (This can also be done for
   *     all blocks if lit_bufsize is not greater than 32K.)
   *   - if compression is not successful for a file smaller than 64K, we can
   *     even emit a stored file instead of a stored block (saving 5 bytes).
   *     This is applicable only for zip (not gzip or zlib).
   *   - creating new Huffman trees less frequently may not provide fast
   *     adaptation to changes in the input data statistics. (Take for
   *     example a binary file with poorly compressible code followed by
   *     a highly compressible string table.) Smaller buffer sizes give
   *     fast adaptation but have of course the overhead of transmitting
   *     trees more frequently.
   *   - I can't count above 4
   */

  this.sym_next = 0;      /* running index in sym_buf */
  this.sym_end = 0;       /* symbol table full when sym_next reaches this */

  this.opt_len = 0;       /* bit length of current block with optimal trees */
  this.static_len = 0;    /* bit length of current block with static trees */
  this.matches = 0;       /* number of string matches in current block */
  this.insert = 0;        /* bytes at end of window left to insert */


  this.bi_buf = 0;
  /* Output buffer. bits are inserted starting at the bottom (least
   * significant bits).
   */
  this.bi_valid = 0;
  /* Number of valid bits in bi_buf.  All bits above the last valid bit
   * are always zero.
   */

  // Used for window memory init. We safely ignore it for JS. That makes
  // sense only for pointers and memory check tools.
  //this.high_water = 0;
  /* High water mark offset in window for initialized bytes -- bytes above
   * this are set to zero in order to avoid memory check warnings when
   * longest match routines access bytes past the input.  This is then
   * updated to the new high water mark.
   */
}


/* =========================================================================
 * Check for a valid deflate stream state. Return 0 if ok, 1 if not.
 */
const deflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const s = strm.state;
  if (!s || s.strm !== strm || (s.status !== INIT_STATE &&
//#ifdef GZIP
                                s.status !== GZIP_STATE &&
//#endif
                                s.status !== EXTRA_STATE &&
                                s.status !== NAME_STATE &&
                                s.status !== COMMENT_STATE &&
                                s.status !== HCRC_STATE &&
                                s.status !== BUSY_STATE &&
                                s.status !== FINISH_STATE)) {
    return 1;
  }
  return 0;
};


const deflateResetKeep = (strm) => {

  if (deflateStateCheck(strm)) {
    return err(strm, Z_STREAM_ERROR);
  }

  strm.total_in = strm.total_out = 0;
  strm.data_type = Z_UNKNOWN;

  const s = strm.state;
  s.pending = 0;
  s.pending_out = 0;

  if (s.wrap < 0) {
    s.wrap = -s.wrap;
    /* was made negative by deflate(..., Z_FINISH); */
  }
  s.status =
//#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE :
//#endif
    s.wrap ? INIT_STATE : BUSY_STATE;
  strm.adler = (s.wrap === 2) ?
    0  // crc32(0, Z_NULL, 0)
  :
    1; // adler32(0, Z_NULL, 0)
  s.last_flush = -2;
  _tr_init(s);
  return Z_OK;
};


const deflateReset = (strm) => {

  const ret = deflateResetKeep(strm);
  if (ret === Z_OK) {
    lm_init(strm.state);
  }
  return ret;
};


const deflateSetHeader = (strm, head) => {

  if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
    return Z_STREAM_ERROR;
  }
  strm.state.gzhead = head;
  return Z_OK;
};


const deflateInit2 = (strm, level, method, windowBits, memLevel, strategy) => {

  if (!strm) { // === Z_NULL
    return Z_STREAM_ERROR;
  }
  let wrap = 1;

  if (level === Z_DEFAULT_COMPRESSION) {
    level = 6;
  }

  if (windowBits < 0) { /* suppress zlib wrapper */
    wrap = 0;
    windowBits = -windowBits;
  }

  else if (windowBits > 15) {
    wrap = 2;           /* write gzip wrapper instead */
    windowBits -= 16;
  }


  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
    strategy < 0 || strategy > Z_FIXED || (windowBits === 8 && wrap !== 1)) {
    return err(strm, Z_STREAM_ERROR);
  }


  if (windowBits === 8) {
    windowBits = 9;
  }
  /* until 256-byte window bug fixed */

  const s = new DeflateState();

  strm.state = s;
  s.strm = strm;
  s.status = INIT_STATE;     /* to pass state test in deflateReset() */

  s.wrap = wrap;
  s.gzhead = null;
  s.w_bits = windowBits;
  s.w_size = 1 << s.w_bits;
  s.w_mask = s.w_size - 1;

  s.hash_bits = memLevel + 7;
  s.hash_size = 1 << s.hash_bits;
  s.hash_mask = s.hash_size - 1;
  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);

  s.window = new Uint8Array(s.w_size * 2);
  s.head = new Uint16Array(s.hash_size);
  s.prev = new Uint16Array(s.w_size);

  // Don't need mem init magic for JS.
  //s.high_water = 0;  /* nothing written to s->window yet */

  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */

  /* We overlay pending_buf and sym_buf. This works since the average size
   * for length/distance pairs over any compressed block is assured to be 31
   * bits or less.
   *
   * Analysis: The longest fixed codes are a length code of 8 bits plus 5
   * extra bits, for lengths 131 to 257. The longest fixed distance codes are
   * 5 bits plus 13 extra bits, for distances 16385 to 32768. The longest
   * possible fixed-codes length/distance pair is then 31 bits total.
   *
   * sym_buf starts one-fourth of the way into pending_buf. So there are
   * three bytes in sym_buf for every four bytes in pending_buf. Each symbol
   * in sym_buf is three bytes -- two for the distance and one for the
   * literal/length. As each symbol is consumed, the pointer to the next
   * sym_buf value to read moves forward three bytes. From that symbol, up to
   * 31 bits are written to pending_buf. The closest the written pending_buf
   * bits gets to the next sym_buf symbol to read is just before the last
   * code is written. At that time, 31*(n-2) bits have been written, just
   * after 24*(n-2) bits have been consumed from sym_buf. sym_buf starts at
   * 8*n bits into pending_buf. (Note that the symbol buffer fills when n-1
   * symbols are written.) The closest the writing gets to what is unread is
   * then n+14 bits. Here n is lit_bufsize, which is 16384 by default, and
   * can range from 128 to 32768.
   *
   * Therefore, at a minimum, there are 142 bits of space between what is
   * written and what is read in the overlain buffers, so the symbols cannot
   * be overwritten by the compressed data. That space is actually 139 bits,
   * due to the three-bit fixed-code block header.
   *
   * That covers the case where either Z_FIXED is specified, forcing fixed
   * codes, or when the use of fixed codes is chosen, because that choice
   * results in a smaller compressed block than dynamic codes. That latter
   * condition then assures that the above analysis also covers all dynamic
   * blocks. A dynamic-code block will only be chosen to be emitted if it has
   * fewer bits than a fixed-code block would for the same set of symbols.
   * Therefore its average symbol length is assured to be less than 31. So
   * the compressed data for a dynamic block also cannot overwrite the
   * symbols from which it is being constructed.
   */

  s.pending_buf_size = s.lit_bufsize * 4;
  s.pending_buf = new Uint8Array(s.pending_buf_size);

  // It is offset from `s.pending_buf` (size is `s.lit_bufsize * 2`)
  //s->sym_buf = s->pending_buf + s->lit_bufsize;
  s.sym_buf = s.lit_bufsize;

  //s->sym_end = (s->lit_bufsize - 1) * 3;
  s.sym_end = (s.lit_bufsize - 1) * 3;
  /* We avoid equality with lit_bufsize*3 because of wraparound at 64K
   * on 16 bit machines and because stored blocks are restricted to
   * 64K-1 bytes.
   */

  s.level = level;
  s.strategy = strategy;
  s.method = method;

  return deflateReset(strm);
};

const deflateInit = (strm, level) => {

  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
};


/* ========================================================================= */
const deflate = (strm, flush) => {

  if (deflateStateCheck(strm) || flush > Z_BLOCK || flush < 0) {
    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
  }

  const s = strm.state;

  if (!strm.output ||
      (strm.avail_in !== 0 && !strm.input) ||
      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
  }

  const old_flush = s.last_flush;
  s.last_flush = flush;

  /* Flush as much pending output as possible */
  if (s.pending !== 0) {
    flush_pending(strm);
    if (strm.avail_out === 0) {
      /* Since avail_out is 0, deflate will be called again with
       * more output space, but possibly with both pending and
       * avail_in equal to zero. There won't be anything to do,
       * but this is not an error situation so make sure we
       * return OK instead of BUF_ERROR at next call of deflate:
       */
      s.last_flush = -1;
      return Z_OK;
    }

    /* Make sure there is something to do and avoid duplicate consecutive
     * flushes. For repeated and useless calls with Z_FINISH, we keep
     * returning Z_STREAM_END instead of Z_BUF_ERROR.
     */
  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
    flush !== Z_FINISH) {
    return err(strm, Z_BUF_ERROR);
  }

  /* User must not provide more input after the first FINISH: */
  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
    return err(strm, Z_BUF_ERROR);
  }

  /* Write the header */
  if (s.status === INIT_STATE && s.wrap === 0) {
    s.status = BUSY_STATE;
  }
  if (s.status === INIT_STATE) {
    /* zlib header */
    let header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
    let level_flags = -1;

    if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
      level_flags = 0;
    } else if (s.level < 6) {
      level_flags = 1;
    } else if (s.level === 6) {
      level_flags = 2;
    } else {
      level_flags = 3;
    }
    header |= (level_flags << 6);
    if (s.strstart !== 0) { header |= PRESET_DICT; }
    header += 31 - (header % 31);

    putShortMSB(s, header);

    /* Save the adler32 of the preset dictionary: */
    if (s.strstart !== 0) {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 0xffff);
    }
    strm.adler = 1; // adler32(0L, Z_NULL, 0);
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK;
    }
  }
//#ifdef GZIP
  if (s.status === GZIP_STATE) {
    /* gzip header */
    strm.adler = 0;  //crc32(0L, Z_NULL, 0);
    put_byte(s, 31);
    put_byte(s, 139);
    put_byte(s, 8);
    if (!s.gzhead) { // s->gzhead == Z_NULL
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, 0);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, OS_CODE);
      s.status = BUSY_STATE;

      /* Compression must start with an empty pending buffer */
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK;
      }
    }
    else {
      put_byte(s, (s.gzhead.text ? 1 : 0) +
                  (s.gzhead.hcrc ? 2 : 0) +
                  (!s.gzhead.extra ? 0 : 4) +
                  (!s.gzhead.name ? 0 : 8) +
                  (!s.gzhead.comment ? 0 : 16)
      );
      put_byte(s, s.gzhead.time & 0xff);
      put_byte(s, (s.gzhead.time >> 8) & 0xff);
      put_byte(s, (s.gzhead.time >> 16) & 0xff);
      put_byte(s, (s.gzhead.time >> 24) & 0xff);
      put_byte(s, s.level === 9 ? 2 :
                  (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
                   4 : 0));
      put_byte(s, s.gzhead.os & 0xff);
      if (s.gzhead.extra && s.gzhead.extra.length) {
        put_byte(s, s.gzhead.extra.length & 0xff);
        put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
      }
      if (s.gzhead.hcrc) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
      }
      s.gzindex = 0;
      s.status = EXTRA_STATE;
    }
  }
  if (s.status === EXTRA_STATE) {
    if (s.gzhead.extra/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let left = (s.gzhead.extra.length & 0xffff) - s.gzindex;
      while (s.pending + left > s.pending_buf_size) {
        let copy = s.pending_buf_size - s.pending;
        // zmemcpy(s.pending_buf + s.pending,
        //    s.gzhead.extra + s.gzindex, copy);
        s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
        s.pending = s.pending_buf_size;
        //--- HCRC_UPDATE(beg) ---//
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        //---//
        s.gzindex += copy;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK;
        }
        beg = 0;
        left -= copy;
      }
      // JS specific: s.gzhead.extra may be TypedArray or Array for backward compatibility
      //              TypedArray.slice and TypedArray.from don't exist in IE10-IE11
      let gzhead_extra = new Uint8Array(s.gzhead.extra);
      // zmemcpy(s->pending_buf + s->pending,
      //     s->gzhead->extra + s->gzindex, left);
      s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
      s.pending += left;
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = NAME_STATE;
  }
  if (s.status === NAME_STATE) {
    if (s.gzhead.name/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.name.length) {
          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
      s.gzindex = 0;
    }
    s.status = COMMENT_STATE;
  }
  if (s.status === COMMENT_STATE) {
    if (s.gzhead.comment/* != Z_NULL*/) {
      let beg = s.pending;   /* start of bytes to update crc */
      let val;
      do {
        if (s.pending === s.pending_buf_size) {
          //--- HCRC_UPDATE(beg) ---//
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          //---//
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK;
          }
          beg = 0;
        }
        // JS specific: little magic to add zero terminator to end of string
        if (s.gzindex < s.gzhead.comment.length) {
          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
        } else {
          val = 0;
        }
        put_byte(s, val);
      } while (val !== 0);
      //--- HCRC_UPDATE(beg) ---//
      if (s.gzhead.hcrc && s.pending > beg) {
        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
      }
      //---//
    }
    s.status = HCRC_STATE;
  }
  if (s.status === HCRC_STATE) {
    if (s.gzhead.hcrc) {
      if (s.pending + 2 > s.pending_buf_size) {
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK;
        }
      }
      put_byte(s, strm.adler & 0xff);
      put_byte(s, (strm.adler >> 8) & 0xff);
      strm.adler = 0; //crc32(0L, Z_NULL, 0);
    }
    s.status = BUSY_STATE;

    /* Compression must start with an empty pending buffer */
    flush_pending(strm);
    if (s.pending !== 0) {
      s.last_flush = -1;
      return Z_OK;
    }
  }
//#endif

  /* Start a new block or continue the current one.
   */
  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
    let bstate = s.level === 0 ? deflate_stored(s, flush) :
                 s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) :
                 s.strategy === Z_RLE ? deflate_rle(s, flush) :
                 configuration_table[s.level].func(s, flush);

    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
      s.status = FINISH_STATE;
    }
    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        /* avoid BUF_ERROR next call, see above */
      }
      return Z_OK;
      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
       * of deflate should use the same flush parameter to make sure
       * that the flush is complete. So we don't have to output an
       * empty block here, this will be done at next call. This also
       * ensures that for a very small output buffer, we emit at most
       * one empty block.
       */
    }
    if (bstate === BS_BLOCK_DONE) {
      if (flush === Z_PARTIAL_FLUSH) {
        _tr_align(s);
      }
      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */

        _tr_stored_block(s, 0, 0, false);
        /* For a full flush, this empty block will be recognized
         * as a special marker by inflate_sync().
         */
        if (flush === Z_FULL_FLUSH) {
          /*** CLEAR_HASH(s); ***/             /* forget history */
          zero(s.head); // Fill with NIL (= 0);

          if (s.lookahead === 0) {
            s.strstart = 0;
            s.block_start = 0;
            s.insert = 0;
          }
        }
      }
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
        return Z_OK;
      }
    }
  }

  if (flush !== Z_FINISH) { return Z_OK; }
  if (s.wrap <= 0) { return Z_STREAM_END; }

  /* Write the trailer */
  if (s.wrap === 2) {
    put_byte(s, strm.adler & 0xff);
    put_byte(s, (strm.adler >> 8) & 0xff);
    put_byte(s, (strm.adler >> 16) & 0xff);
    put_byte(s, (strm.adler >> 24) & 0xff);
    put_byte(s, strm.total_in & 0xff);
    put_byte(s, (strm.total_in >> 8) & 0xff);
    put_byte(s, (strm.total_in >> 16) & 0xff);
    put_byte(s, (strm.total_in >> 24) & 0xff);
  }
  else
  {
    putShortMSB(s, strm.adler >>> 16);
    putShortMSB(s, strm.adler & 0xffff);
  }

  flush_pending(strm);
  /* If avail_out is zero, the application will call deflate again
   * to flush the rest.
   */
  if (s.wrap > 0) { s.wrap = -s.wrap; }
  /* write the trailer only once! */
  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
};


const deflateEnd = (strm) => {

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR;
  }

  const status = strm.state.status;

  strm.state = null;

  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
};


/* =========================================================================
 * Initializes the compression dictionary from the given byte
 * sequence without producing any compressed output.
 */
const deflateSetDictionary = (strm, dictionary) => {

  let dictLength = dictionary.length;

  if (deflateStateCheck(strm)) {
    return Z_STREAM_ERROR;
  }

  const s = strm.state;
  const wrap = s.wrap;

  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
    return Z_STREAM_ERROR;
  }

  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
  if (wrap === 1) {
    /* adler32(strm->adler, dictionary, dictLength); */
    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
  }

  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */

  /* if dictionary would fill window, just replace the history */
  if (dictLength >= s.w_size) {
    if (wrap === 0) {            /* already empty otherwise */
      /*** CLEAR_HASH(s); ***/
      zero(s.head); // Fill with NIL (= 0);
      s.strstart = 0;
      s.block_start = 0;
      s.insert = 0;
    }
    /* use the tail */
    // dictionary = dictionary.slice(dictLength - s.w_size);
    let tmpDict = new Uint8Array(s.w_size);
    tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
    dictionary = tmpDict;
    dictLength = s.w_size;
  }
  /* insert dictionary into window and hash */
  const avail = strm.avail_in;
  const next = strm.next_in;
  const input = strm.input;
  strm.avail_in = dictLength;
  strm.next_in = 0;
  strm.input = dictionary;
  fill_window(s);
  while (s.lookahead >= MIN_MATCH) {
    let str = s.strstart;
    let n = s.lookahead - (MIN_MATCH - 1);
    do {
      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
      s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);

      s.prev[str & s.w_mask] = s.head[s.ins_h];

      s.head[s.ins_h] = str;
      str++;
    } while (--n);
    s.strstart = str;
    s.lookahead = MIN_MATCH - 1;
    fill_window(s);
  }
  s.strstart += s.lookahead;
  s.block_start = s.strstart;
  s.insert = s.lookahead;
  s.lookahead = 0;
  s.match_length = s.prev_length = MIN_MATCH - 1;
  s.match_available = 0;
  strm.next_in = next;
  strm.input = input;
  strm.avail_in = avail;
  s.wrap = wrap;
  return Z_OK;
};


module.exports.deflateInit = deflateInit;
module.exports.deflateInit2 = deflateInit2;
module.exports.deflateReset = deflateReset;
module.exports.deflateResetKeep = deflateResetKeep;
module.exports.deflateSetHeader = deflateSetHeader;
module.exports.deflate = deflate;
module.exports.deflateEnd = deflateEnd;
module.exports.deflateSetDictionary = deflateSetDictionary;
module.exports.deflateInfo = 'pako deflate (from Nodeca project)';

/* Not implemented
module.exports.deflateBound = deflateBound;
module.exports.deflateCopy = deflateCopy;
module.exports.deflateGetDictionary = deflateGetDictionary;
module.exports.deflateParams = deflateParams;
module.exports.deflatePending = deflatePending;
module.exports.deflatePrime = deflatePrime;
module.exports.deflateTune = deflateTune;
*/


/***/ }),

/***/ 414:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function GZheader() {
  /* true if compressed data believed to be text */
  this.text       = 0;
  /* modification time */
  this.time       = 0;
  /* extra flags (not used when writing a gzip file) */
  this.xflags     = 0;
  /* operating system */
  this.os         = 0;
  /* pointer to extra field or Z_NULL if none */
  this.extra      = null;
  /* extra field length (valid if extra != Z_NULL) */
  this.extra_len  = 0; // Actually, we don't need it in JS,
                       // but leave for few code modifications

  //
  // Setup limits is not necessary because in js we should not preallocate memory
  // for inflate use constant limit in 65536 bytes
  //

  /* space at extra (only when reading header) */
  // this.extra_max  = 0;
  /* pointer to zero-terminated file name or Z_NULL */
  this.name       = '';
  /* space at name (only when reading header) */
  // this.name_max   = 0;
  /* pointer to zero-terminated comment or Z_NULL */
  this.comment    = '';
  /* space at comment (only when reading header) */
  // this.comm_max   = 0;
  /* true if there was or will be a header crc */
  this.hcrc       = 0;
  /* true when done reading gzip header (not used when writing a gzip file) */
  this.done       = false;
}

module.exports = GZheader;


/***/ }),

/***/ 418:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var parser = __webpack_require__(635)

/**
 * Create a Soundfont object
 *
 * @param {AudioContext} context - the [audio context](https://developer.mozilla.org/en/docs/Web/API/AudioContext)
 * @param {Function} nameToUrl - (Optional) a function that maps the sound font name to the url
 * @return {Soundfont} a soundfont object
 */
function Soundfont (ctx, nameToUrl) {
  console.warn('new Soundfont() is deprected')
  console.log('Please use Soundfont.instrument() instead of new Soundfont().instrument()')
  if (!(this instanceof Soundfont)) return new Soundfont(ctx)

  this.nameToUrl = nameToUrl || Soundfont.nameToUrl
  this.ctx = ctx
  this.instruments = {}
  this.promises = []
}

Soundfont.prototype.onready = function (callback) {
  console.warn('deprecated API')
  console.log('Please use Promise.all(Soundfont.instrument(), Soundfont.instrument()).then() instead of new Soundfont().onready()')
  Promise.all(this.promises).then(callback)
}

Soundfont.prototype.instrument = function (name, options) {
  console.warn('new Soundfont().instrument() is deprecated.')
  console.log('Please use Soundfont.instrument() instead.')
  var ctx = this.ctx
  name = name || 'default'
  if (name in this.instruments) return this.instruments[name]
  var inst = {name: name, play: oscillatorPlayer(ctx, options)}
  this.instruments[name] = inst
  if (name !== 'default') {
    var promise = Soundfont.instrument(ctx, name, options).then(function (instrument) {
      inst.play = instrument.play
      return inst
    })
    this.promises.push(promise)
    inst.onready = function (cb) {
      console.warn('onready is deprecated. Use Soundfont.instrument().then()')
      promise.then(cb)
    }
  } else {
    inst.onready = function (cb) {
      console.warn('onready is deprecated. Use Soundfont.instrument().then()')
      cb()
    }
  }
  return inst
}

/*
 * Load the buffers of a given instrument name. It returns a promise that resolves
 * to a hash with midi note numbers as keys, and audio buffers as values.
 *
 * @param {AudioContext} ac - the audio context
 * @param {String} name - the instrument name (it accepts an url if starts with "http")
 * @param {Object} options - (Optional) options object
 * @return {Promise} a promise that resolves to a Hash of { midiNoteNum: <AudioBuffer> }
 *
 * The options object accepts the following keys:
 *
 * - nameToUrl {Function}: a function to convert from instrument names to urls.
 * By default it uses Benjamin Gleitzman's package of
 * [pre-rendered sound fonts](https://github.com/gleitz/midi-js-soundfonts)
 * - notes {Array}: the list of note names to be decoded (all by default)
 *
 * @example
 * var Soundfont = require('soundfont-player')
 * Soundfont.loadBuffers(ctx, 'acoustic_grand_piano').then(function(buffers) {
 *  buffers[60] // => An <AudioBuffer> corresponding to note C4
 * })
 */
function loadBuffers (ac, name, options) {
  console.warn('Soundfont.loadBuffers is deprecate.')
  console.log('Use Soundfont.instrument(..) and get buffers properties from the result.')
  return Soundfont.instrument(ac, name, options).then(function (inst) {
    return inst.buffers
  })
}
Soundfont.loadBuffers = loadBuffers

/**
 * Returns a function that plays an oscillator
 *
 * @param {AudioContext} ac - the audio context
 * @param {Hash} defaultOptions - (Optional) a hash of options:
 * - vcoType: the oscillator type (default: 'sine')
 * - gain: the output gain value (default: 0.4)
  * - destination: the player destination (default: ac.destination)
 */
function oscillatorPlayer (ctx, defaultOptions) {
  defaultOptions = defaultOptions || {}
  return function (note, time, duration, options) {
    console.warn('The oscillator player is deprecated.')
    console.log('Starting with version 0.9.0 you will have to wait until the soundfont is loaded to play sounds.')
    var midi = note > 0 && note < 129 ? +note : parser.midi(note)
    var freq = midi ? parser.midiToFreq(midi, 440) : null
    if (!freq) return

    duration = duration || 0.2

    options = options || {}
    var destination = options.destination || defaultOptions.destination || ctx.destination
    var vcoType = options.vcoType || defaultOptions.vcoType || 'sine'
    var gain = options.gain || defaultOptions.gain || 0.4

    var vco = ctx.createOscillator()
    vco.type = vcoType
    vco.frequency.value = freq

    /* VCA */
    var vca = ctx.createGain()
    vca.gain.value = gain

    /* Connections */
    vco.connect(vca)
    vca.connect(destination)

    vco.start(time)
    if (duration > 0) vco.stop(time + duration)
    return vco
  }
}

/**
 * Given a note name, return the note midi number
 *
 * @name noteToMidi
 * @function
 * @param {String} noteName
 * @return {Integer} the note midi number or null if not a valid note name
 */
Soundfont.noteToMidi = parser.midi

module.exports = Soundfont


/***/ }),

/***/ 442:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

function ZStream() {
  /* next input byte */
  this.input = null; // JS specific, because we have no pointers
  this.next_in = 0;
  /* number of bytes available at input */
  this.avail_in = 0;
  /* total number of input bytes read so far */
  this.total_in = 0;
  /* next output byte should be put there */
  this.output = null; // JS specific, because we have no pointers
  this.next_out = 0;
  /* remaining free space at output */
  this.avail_out = 0;
  /* total number of bytes output so far */
  this.total_out = 0;
  /* last error message, NULL if no error */
  this.msg = ''/*Z_NULL*/;
  /* not visible by applications */
  this.state = null;
  /* best guess about the data type: binary or text */
  this.data_type = 2/*Z_UNKNOWN*/;
  /* adler32 value of the uncompressed data */
  this.adler = 0;
}

module.exports = ZStream;


/***/ }),

/***/ 443:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ index)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

/**
 * Constants used in player.
 */
var Constants = {
  VERSION: '2.0.16',
  NOTES: [],
  HEADER_CHUNK_LENGTH: 14,
  CIRCLE_OF_FOURTHS: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb', 'Bbb', 'Ebb', 'Abb'],
  CIRCLE_OF_FIFTHS: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'E#']
}; // Builds notes object for reference against binary values.

var allNotes = [['C'], ['C#', 'Db'], ['D'], ['D#', 'Eb'], ['E'], ['F'], ['F#', 'Gb'], ['G'], ['G#', 'Ab'], ['A'], ['A#', 'Bb'], ['B']];
var counter = 0; // All available octaves.

var _loop = function _loop(i) {
  allNotes.forEach(function (noteGroup) {
    noteGroup.forEach(function (note) {
      return Constants.NOTES[counter] = note + i;
    });
    counter++;
  });
};

for (var i = -1; i <= 9; i++) {
  _loop(i);
}

/**
 * Contains misc static utility methods.
 */
var Utils = /*#__PURE__*/function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  _createClass(Utils, null, [{
    key: "byteToHex",
    value:
    /**
     * Converts a single byte to a hex string.
     * @param {number} byte
     * @return {string}
     */
    function byteToHex(_byte) {
      // Ensure hex string always has two chars
      return ('0' + _byte.toString(16)).slice(-2);
    }
    /**
     * Converts an array of bytes to a hex string.
     * @param {array} byteArray
     * @return {string}
     */

  }, {
    key: "bytesToHex",
    value: function bytesToHex(byteArray) {
      var hex = [];
      byteArray.forEach(function (_byte2) {
        return hex.push(Utils.byteToHex(_byte2));
      });
      return hex.join('');
    }
    /**
     * Converts a hex string to a number.
     * @param {string} hexString
     * @return {number}
     */

  }, {
    key: "hexToNumber",
    value: function hexToNumber(hexString) {
      return parseInt(hexString, 16);
    }
    /**
     * Converts an array of bytes to a number.
     * @param {array} byteArray
     * @return {number}
     */

  }, {
    key: "bytesToNumber",
    value: function bytesToNumber(byteArray) {
      return Utils.hexToNumber(Utils.bytesToHex(byteArray));
    }
    /**
     * Converts an array of bytes to letters.
     * @param {array} byteArray
     * @return {string}
     */

  }, {
    key: "bytesToLetters",
    value: function bytesToLetters(byteArray) {
      var letters = [];
      byteArray.forEach(function (_byte3) {
        return letters.push(String.fromCharCode(_byte3));
      });
      return letters.join('');
    }
    /**
     * Converts a decimal to it's binary representation.
     * @param {number} dec
     * @return {string}
     */

  }, {
    key: "decToBinary",
    value: function decToBinary(dec) {
      return (dec >>> 0).toString(2);
    }
    /**
     * Determines the length in bytes of a variable length quaantity.  The first byte in given range is assumed to be beginning of var length quantity.
     * @param {array} byteArray
     * @return {number}
     */

  }, {
    key: "getVarIntLength",
    value: function getVarIntLength(byteArray) {
      // Get byte count of delta VLV
      // http://www.ccarh.org/courses/253/handout/vlv/
      // If byte is greater or equal to 80h (128 decimal) then the next byte
      // is also part of the VLV,
      // else byte is the last byte in a VLV.
      var currentByte = byteArray[0];
      var byteCount = 1;

      while (currentByte >= 128) {
        currentByte = byteArray[byteCount];
        byteCount++;
      }

      return byteCount;
    }
    /**
     * Reads a variable length value.
     * @param {array} byteArray
     * @return {number}
     */

  }, {
    key: "readVarInt",
    value: function readVarInt(byteArray) {
      var result = 0;
      byteArray.forEach(function (number) {
        var b = number;

        if (b & 0x80) {
          result += b & 0x7f;
          result <<= 7;
        } else {
          /* b is the last byte */
          result += b;
        }
      });
      return result;
    }
    /**
     * Decodes base-64 encoded string
     * @param {string} string
     * @return {string}
     */

  }, {
    key: "atob",
    value: function (_atob) {
      function atob(_x) {
        return _atob.apply(this, arguments);
      }

      atob.toString = function () {
        return _atob.toString();
      };

      return atob;
    }(function (string) {
      if (typeof atob === 'function') return atob(string);
      return Buffer.from(string, 'base64').toString('binary');
    })
  }]);

  return Utils;
}();

/**
 * Class representing a track.  Contains methods for parsing events and keeping track of pointer.
 */

var Track = /*#__PURE__*/function () {
  function Track(index, data) {
    _classCallCheck(this, Track);

    this.enabled = true;
    this.eventIndex = 0;
    this.pointer = 0;
    this.lastTick = 0;
    this.lastStatus = null;
    this.index = index;
    this.data = data;
    this.delta = 0;
    this.runningDelta = 0;
    this.events = []; // Ensure last 3 bytes of track are End of Track event

    var lastThreeBytes = this.data.subarray(this.data.length - 3, this.data.length);

    if (!(lastThreeBytes[0] === 0xff && lastThreeBytes[1] === 0x2f && lastThreeBytes[2] === 0x00)) {
      throw 'Invalid MIDI file; Last three bytes of track ' + this.index + 'must be FF 2F 00 to mark end of track';
    }
  }
  /**
   * Resets all stateful track informaion used during playback.
   * @return {Track}
   */


  _createClass(Track, [{
    key: "reset",
    value: function reset() {
      this.enabled = true;
      this.eventIndex = 0;
      this.pointer = 0;
      this.lastTick = 0;
      this.lastStatus = null;
      this.delta = 0;
      this.runningDelta = 0;
      return this;
    }
    /**
     * Sets this track to be enabled during playback.
     * @return {Track}
     */

  }, {
    key: "enable",
    value: function enable() {
      this.enabled = true;
      return this;
    }
    /**
     * Sets this track to be disabled during playback.
     * @return {Track}
     */

  }, {
    key: "disable",
    value: function disable() {
      this.enabled = false;
      return this;
    }
    /**
     * Sets the track event index to the nearest event to the given tick.
     * @param {number} tick
     * @return {Track}
     */

  }, {
    key: "setEventIndexByTick",
    value: function setEventIndexByTick(tick) {
      tick = tick || 0;

      for (var i in this.events) {
        if (this.events[i].tick >= tick) {
          this.eventIndex = i;
          return this;
        }
      }
    }
    /**
     * Gets byte located at pointer position.
     * @return {number}
     */

  }, {
    key: "getCurrentByte",
    value: function getCurrentByte() {
      return this.data[this.pointer];
    }
    /**
     * Gets count of delta bytes and current pointer position.
     * @return {number}
     */

  }, {
    key: "getDeltaByteCount",
    value: function getDeltaByteCount() {
      return Utils.getVarIntLength(this.data.subarray(this.pointer));
    }
    /**
     * Get delta value at current pointer position.
     * @return {number}
     */

  }, {
    key: "getDelta",
    value: function getDelta() {
      return Utils.readVarInt(this.data.subarray(this.pointer, this.pointer + this.getDeltaByteCount()));
    }
    /**
     * Handles event within a given track starting at specified index
     * @param {number} currentTick
     * @param {boolean} dryRun - If true events will be parsed and returned regardless of time.
     */

  }, {
    key: "handleEvent",
    value: function handleEvent(currentTick, dryRun) {
      dryRun = dryRun || false;

      if (dryRun) {
        var elapsedTicks = currentTick - this.lastTick;
        var delta = this.getDelta();
        var eventReady = elapsedTicks >= delta;

        if (this.pointer < this.data.length && (dryRun || eventReady)) {
          var _event = this.parseEvent();

          if (this.enabled) return _event; // Recursively call this function for each event ahead that has 0 delta time?
        }
      } else {
        // Let's actually play the MIDI from the generated JSON events created by the dry run.
        if (this.events[this.eventIndex] && this.events[this.eventIndex].tick <= currentTick) {
          this.eventIndex++;
          if (this.enabled) return this.events[this.eventIndex - 1];
        }
      }

      return null;
    }
    /**
     * Get string data from event.
     * @param {number} eventStartIndex
     * @return {string}
     */

  }, {
    key: "getStringData",
    value: function getStringData(eventStartIndex) {
      var varIntLength = Utils.getVarIntLength(this.data.subarray(eventStartIndex + 2));
      var varIntValue = Utils.readVarInt(this.data.subarray(eventStartIndex + 2, eventStartIndex + 2 + varIntLength));
      var letters = Utils.bytesToLetters(this.data.subarray(eventStartIndex + 2 + varIntLength, eventStartIndex + 2 + varIntLength + varIntValue));
      return letters;
    }
    /**
     * Parses event into JSON and advances pointer for the track
     * @return {object}
     */

  }, {
    key: "parseEvent",
    value: function parseEvent() {
      var eventStartIndex = this.pointer + this.getDeltaByteCount();
      var eventJson = {};
      var deltaByteCount = this.getDeltaByteCount();
      eventJson.track = this.index + 1;
      eventJson.delta = this.getDelta();
      this.lastTick = this.lastTick + eventJson.delta;
      this.runningDelta += eventJson.delta;
      eventJson.tick = this.runningDelta;
      eventJson.byteIndex = this.pointer; //eventJson.raw = event;

      if (this.data[eventStartIndex] == 0xff) {
        // Meta Event
        // If this is a meta event we should emit the data and immediately move to the next event
        // otherwise if we let it run through the next cycle a slight delay will accumulate if multiple tracks
        // are being played simultaneously
        switch (this.data[eventStartIndex + 1]) {
          case 0x00:
            // Sequence Number
            eventJson.name = 'Sequence Number';
            break;

          case 0x01:
            // Text Event
            eventJson.name = 'Text Event';
            eventJson.string = this.getStringData(eventStartIndex);
            break;

          case 0x02:
            // Copyright Notice
            eventJson.name = 'Copyright Notice';
            break;

          case 0x03:
            // Sequence/Track Name
            eventJson.name = 'Sequence/Track Name';
            eventJson.string = this.getStringData(eventStartIndex);
            break;

          case 0x04:
            // Instrument Name
            eventJson.name = 'Instrument Name';
            eventJson.string = this.getStringData(eventStartIndex);
            break;

          case 0x05:
            // Lyric
            eventJson.name = 'Lyric';
            eventJson.string = this.getStringData(eventStartIndex);
            break;

          case 0x06:
            // Marker
            eventJson.name = 'Marker';
            break;

          case 0x07:
            // Cue Point
            eventJson.name = 'Cue Point';
            eventJson.string = this.getStringData(eventStartIndex);
            break;

          case 0x09:
            // Device Name
            eventJson.name = 'Device Name';
            eventJson.string = this.getStringData(eventStartIndex);
            break;

          case 0x20:
            // MIDI Channel Prefix
            eventJson.name = 'MIDI Channel Prefix';
            break;

          case 0x21:
            // MIDI Port
            eventJson.name = 'MIDI Port';
            eventJson.data = Utils.bytesToNumber([this.data[eventStartIndex + 3]]);
            break;

          case 0x2F:
            // End of Track
            eventJson.name = 'End of Track';
            break;

          case 0x51:
            // Set Tempo
            eventJson.name = 'Set Tempo';
            eventJson.data = Math.round(60000000 / Utils.bytesToNumber(this.data.subarray(eventStartIndex + 3, eventStartIndex + 6)));
            this.tempo = eventJson.data;
            break;

          case 0x54:
            // SMTPE Offset
            eventJson.name = 'SMTPE Offset';
            break;

          case 0x58:
            // Time Signature
            // FF 58 04 nn dd cc bb
            eventJson.name = 'Time Signature';
            eventJson.data = this.data.subarray(eventStartIndex + 3, eventStartIndex + 7);
            eventJson.timeSignature = "" + eventJson.data[0] + "/" + Math.pow(2, eventJson.data[1]);
            break;

          case 0x59:
            // Key Signature
            // FF 59 02 sf mi
            eventJson.name = 'Key Signature';
            eventJson.data = this.data.subarray(eventStartIndex + 3, eventStartIndex + 5);

            if (eventJson.data[0] >= 0) {
              eventJson.keySignature = Constants.CIRCLE_OF_FIFTHS[eventJson.data[0]];
            } else if (eventJson.data[0] < 0) {
              eventJson.keySignature = Constants.CIRCLE_OF_FOURTHS[Math.abs(eventJson.data[0])];
            }

            if (eventJson.data[1] == 0) {
              eventJson.keySignature += " Major";
            } else if (eventJson.data[1] == 1) {
              eventJson.keySignature += " Minor";
            }

            break;

          case 0x7F:
            // Sequencer-Specific Meta-event
            eventJson.name = 'Sequencer-Specific Meta-event';
            break;

          default:
            eventJson.name = 'Unknown: ' + this.data[eventStartIndex + 1].toString(16);
            break;
        }

        var varIntLength = Utils.getVarIntLength(this.data.subarray(eventStartIndex + 2));
        var length = Utils.readVarInt(this.data.subarray(eventStartIndex + 2, eventStartIndex + 2 + varIntLength)); //console.log(eventJson);

        this.pointer += deltaByteCount + 3 + length; //console.log(eventJson);
      } else if (this.data[eventStartIndex] === 0xf0) {
        // Sysex
        eventJson.name = 'Sysex';
        var varQuantityByteLength = Utils.getVarIntLength(this.data.subarray(eventStartIndex + 1));
        var varQuantityByteValue = Utils.readVarInt(this.data.subarray(eventStartIndex + 1, eventStartIndex + 1 + varQuantityByteLength));
        eventJson.data = this.data.subarray(eventStartIndex + 1 + varQuantityByteLength, eventStartIndex + 1 + varQuantityByteLength + varQuantityByteValue);
        this.pointer += deltaByteCount + 1 + varQuantityByteLength + varQuantityByteValue;
      } else if (this.data[eventStartIndex] === 0xf7) {
        // Sysex (escape)
        // http://www.somascape.org/midi/tech/mfile.html#sysex
        eventJson.name = 'Sysex (escape)';

        var _varQuantityByteLength = Utils.getVarIntLength(this.data.subarray(eventStartIndex + 1));

        var _varQuantityByteValue = Utils.readVarInt(this.data.subarray(eventStartIndex + 1, eventStartIndex + 1 + _varQuantityByteLength));

        eventJson.data = this.data.subarray(eventStartIndex + 1 + _varQuantityByteLength, eventStartIndex + 1 + _varQuantityByteLength + _varQuantityByteValue);
        this.pointer += deltaByteCount + 1 + _varQuantityByteLength + _varQuantityByteValue;
      } else {
        // Voice event
        if (this.data[eventStartIndex] < 0x80) {
          // Running status
          eventJson.running = true;
          eventJson.noteNumber = this.data[eventStartIndex];
          eventJson.noteName = Constants.NOTES[this.data[eventStartIndex]];
          eventJson.velocity = this.data[eventStartIndex + 1];

          if (this.lastStatus <= 0x8f) {
            eventJson.name = 'Note off';
            eventJson.channel = this.lastStatus - 0x80 + 1;
            this.pointer += deltaByteCount + 2;
          } else if (this.lastStatus <= 0x9f) {
            eventJson.name = 'Note on';
            eventJson.channel = this.lastStatus - 0x90 + 1;
            this.pointer += deltaByteCount + 2;
          } else if (this.lastStatus <= 0xaf) {
            // Polyphonic Key Pressure
            eventJson.name = 'Polyphonic Key Pressure';
            eventJson.channel = this.lastStatus - 0xa0 + 1;
            eventJson.note = Constants.NOTES[this.data[eventStartIndex + 1]];
            eventJson.pressure = event[1];
            this.pointer += deltaByteCount + 2;
          } else if (this.lastStatus <= 0xbf) {
            // Controller Change
            eventJson.name = 'Controller Change';
            eventJson.channel = this.lastStatus - 0xb0 + 1;
            eventJson.number = this.data[eventStartIndex + 1];
            eventJson.value = this.data[eventStartIndex + 2];
            this.pointer += deltaByteCount + 2;
          } else if (this.lastStatus <= 0xcf) {
            // Program Change
            eventJson.name = 'Program Change';
            eventJson.channel = this.lastStatus - 0xc0 + 1;
            eventJson.value = this.data[eventStartIndex + 1];
            this.pointer += deltaByteCount + 1;
          } else if (this.lastStatus <= 0xdf) {
            // Channel Key Pressure
            eventJson.name = 'Channel Key Pressure';
            eventJson.channel = this.lastStatus - 0xd0 + 1;
            this.pointer += deltaByteCount + 1;
          } else if (this.lastStatus <= 0xef) {
            // Pitch Bend
            eventJson.name = 'Pitch Bend';
            eventJson.channel = this.lastStatus - 0xe0 + 1;
            eventJson.value = this.data[eventStartIndex + 2];
            this.pointer += deltaByteCount + 2;
          } else {
            throw "Unknown event (running): ".concat(this.lastStatus);
          }
        } else {
          this.lastStatus = this.data[eventStartIndex];

          if (this.data[eventStartIndex] <= 0x8f) {
            // Note off
            eventJson.name = 'Note off';
            eventJson.channel = this.lastStatus - 0x80 + 1;
            eventJson.noteNumber = this.data[eventStartIndex + 1];
            eventJson.noteName = Constants.NOTES[this.data[eventStartIndex + 1]];
            eventJson.velocity = Math.round(this.data[eventStartIndex + 2] / 127 * 100);
            this.pointer += deltaByteCount + 3;
          } else if (this.data[eventStartIndex] <= 0x9f) {
            // Note on
            eventJson.name = 'Note on';
            eventJson.channel = this.lastStatus - 0x90 + 1;
            eventJson.noteNumber = this.data[eventStartIndex + 1];
            eventJson.noteName = Constants.NOTES[this.data[eventStartIndex + 1]];
            eventJson.velocity = Math.round(this.data[eventStartIndex + 2] / 127 * 100);
            this.pointer += deltaByteCount + 3;
          } else if (this.data[eventStartIndex] <= 0xaf) {
            // Polyphonic Key Pressure
            eventJson.name = 'Polyphonic Key Pressure';
            eventJson.channel = this.lastStatus - 0xa0 + 1;
            eventJson.note = Constants.NOTES[this.data[eventStartIndex + 1]];
            eventJson.pressure = event[2];
            this.pointer += deltaByteCount + 3;
          } else if (this.data[eventStartIndex] <= 0xbf) {
            // Controller Change
            eventJson.name = 'Controller Change';
            eventJson.channel = this.lastStatus - 0xb0 + 1;
            eventJson.number = this.data[eventStartIndex + 1];
            eventJson.value = this.data[eventStartIndex + 2];
            this.pointer += deltaByteCount + 3;
          } else if (this.data[eventStartIndex] <= 0xcf) {
            // Program Change
            eventJson.name = 'Program Change';
            eventJson.channel = this.lastStatus - 0xc0 + 1;
            eventJson.value = this.data[eventStartIndex + 1];
            this.pointer += deltaByteCount + 2;
          } else if (this.data[eventStartIndex] <= 0xdf) {
            // Channel Key Pressure
            eventJson.name = 'Channel Key Pressure';
            eventJson.channel = this.lastStatus - 0xd0 + 1;
            this.pointer += deltaByteCount + 2;
          } else if (this.data[eventStartIndex] <= 0xef) {
            // Pitch Bend
            eventJson.name = 'Pitch Bend';
            eventJson.channel = this.lastStatus - 0xe0 + 1;
            this.pointer += deltaByteCount + 3;
          } else {
            throw "Unknown event: ".concat(this.data[eventStartIndex]); //eventJson.name = `Unknown.  Pointer: ${this.pointer.toString()}, ${eventStartIndex.toString()}, ${this.data[eventStartIndex]}, ${this.data.length}`;
          }
        }
      }

      this.delta += eventJson.delta;
      this.events.push(eventJson);
      return eventJson;
    }
    /**
     * Returns true if pointer has reached the end of the track.
     * @param {boolean}
     */

  }, {
    key: "endOfTrack",
    value: function endOfTrack() {
      if (this.data[this.pointer + 1] == 0xff && this.data[this.pointer + 2] == 0x2f && this.data[this.pointer + 3] == 0x00) {
        return true;
      }

      return false;
    }
  }]);

  return Track;
}();

if (!Uint8Array.prototype.forEach) {
  Object.defineProperty(Uint8Array.prototype, 'forEach', {
    value: Array.prototype.forEach
  });
}
/**
 * Main player class.  Contains methods to load files, start, stop.
 * @param {function} - Callback to fire for each MIDI event.  Can also be added with on('midiEvent', fn)
 * @param {array} - Array buffer of MIDI file (optional).
 */


var Player = /*#__PURE__*/function () {
  function Player(eventHandler, buffer) {
    _classCallCheck(this, Player);

    this.sampleRate = 5; // milliseconds

    this.startTime = 0;
    this.buffer = buffer || null;
    this.midiChunksByteLength = null;
    this.division;
    this.format;
    this.setIntervalId = false;
    this.tracks = [];
    this.instruments = [];
    this.defaultTempo = 120;
    this.tempo = null;
    this.startTick = 0;
    this.tick = 0;
    this.lastTick = null;
    this.inLoop = false;
    this.totalTicks = 0;
    this.events = [];
    this.totalEvents = 0;
    this.eventListeners = {};
    if (typeof eventHandler === 'function') this.on('midiEvent', eventHandler);
  }
  /**
   * Load a file into the player (Node.js only).
   * @param {string} path - Path of file.
   * @return {Player}
   */


  _createClass(Player, [{
    key: "loadFile",
    value: function loadFile(path) {
      {
        throw 'loadFile is only supported on Node.js';
      }
    }
    /**
     * Load an array buffer into the player.
     * @param {array} arrayBuffer - Array buffer of file to be loaded.
     * @return {Player}
     */

  }, {
    key: "loadArrayBuffer",
    value: function loadArrayBuffer(arrayBuffer) {
      this.buffer = new Uint8Array(arrayBuffer);
      return this.fileLoaded();
    }
    /**
     * Load a data URI into the player.
     * @param {string} dataUri - Data URI to be loaded.
     * @return {Player}
     */

  }, {
    key: "loadDataUri",
    value: function loadDataUri(dataUri) {
      // convert base64 to raw binary data held in a string.
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = Utils.atob(dataUri.split(',')[1]); // write the bytes of the string to an ArrayBuffer

      var ia = new Uint8Array(byteString.length);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      this.buffer = ia;
      return this.fileLoaded();
    }
    /**
     * Get filesize of loaded file in number of bytes.
     * @return {number} - The filesize.
     */

  }, {
    key: "getFilesize",
    value: function getFilesize() {
      return this.buffer ? this.buffer.length : 0;
    }
    /**
     * Sets default tempo, parses file for necessary information, and does a dry run to calculate total length.
     * Populates this.events & this.totalTicks.
     * @return {Player}
     */

  }, {
    key: "fileLoaded",
    value: function fileLoaded() {
      if (!this.validate()) throw 'Invalid MIDI file; should start with MThd';
      return this.setTempo(this.defaultTempo).getDivision().getFormat().getTracks().dryRun();
    }
    /**
     * Validates file using simple means - first four bytes should == MThd.
     * @return {boolean}
     */

  }, {
    key: "validate",
    value: function validate() {
      //console.log((this.buffer.subarray(0, 15)));
      return Utils.bytesToLetters(this.buffer.subarray(0, 4)) === 'MThd';
    }
    /**
     * Gets MIDI file format for loaded file.
     * @return {Player}
     */

  }, {
    key: "getFormat",
    value: function getFormat() {
      /*
      MIDI files come in 3 variations:
      Format 0 which contain a single track
      Format 1 which contain one or more simultaneous tracks
      (ie all tracks are to be played simultaneously).
      Format 2 which contain one or more independant tracks
      (ie each track is to be played independantly of the others).
      return Utils.bytesToNumber(this.buffer.subarray(8, 10));
      */
      this.format = Utils.bytesToNumber(this.buffer.subarray(8, 10));
      return this;
    }
    /**
     * Parses out tracks, places them in this.tracks and initializes this.pointers
     * @return {Player}
     */

  }, {
    key: "getTracks",
    value: function getTracks() {
      this.tracks = [];
      var trackOffset = 0;

      while (trackOffset < this.buffer.length) {
        if (Utils.bytesToLetters(this.buffer.subarray(trackOffset, trackOffset + 4)) == 'MTrk') {
          var trackLength = Utils.bytesToNumber(this.buffer.subarray(trackOffset + 4, trackOffset + 8));
          this.tracks.push(new Track(this.tracks.length, this.buffer.subarray(trackOffset + 8, trackOffset + 8 + trackLength)));
        }

        trackOffset += Utils.bytesToNumber(this.buffer.subarray(trackOffset + 4, trackOffset + 8)) + 8;
      } // Get sum of all MIDI chunks here while we're at it


      var trackChunksByteLength = 0;
      this.tracks.forEach(function (track) {
        trackChunksByteLength += 8 + track.data.length;
      });
      this.midiChunksByteLength = Constants.HEADER_CHUNK_LENGTH + trackChunksByteLength;
      return this;
    }
    /**
     * Enables a track for playing.
     * @param {number} trackNumber - Track number
     * @return {Player}
     */

  }, {
    key: "enableTrack",
    value: function enableTrack(trackNumber) {
      this.tracks[trackNumber - 1].enable();
      return this;
    }
    /**
     * Disables a track for playing.
     * @param {number} - Track number
     * @return {Player}
     */

  }, {
    key: "disableTrack",
    value: function disableTrack(trackNumber) {
      this.tracks[trackNumber - 1].disable();
      return this;
    }
    /**
     * Gets quarter note division of loaded MIDI file.
     * @return {Player}
     */

  }, {
    key: "getDivision",
    value: function getDivision() {
      this.division = Utils.bytesToNumber(this.buffer.subarray(12, Constants.HEADER_CHUNK_LENGTH));
      return this;
    }
    /**
     * The main play loop.
     * @param {boolean} - Indicates whether or not this is being called simply for parsing purposes.  Disregards timing if so.
     * @return {undefined}
     */

  }, {
    key: "playLoop",
    value: function playLoop(dryRun) {
      if (!this.inLoop) {
        this.inLoop = true;
        this.tick = this.getCurrentTick();
        this.tracks.forEach(function (track, index) {
          // Handle next event
          if (!dryRun && this.endOfFile()) {
            //console.log('end of file')
            this.triggerPlayerEvent('endOfFile');
            this.stop();
          } else {
            var event = track.handleEvent(this.tick, dryRun);

            if (dryRun && event) {
              if (event.hasOwnProperty('name') && event.name === 'Set Tempo') {
                // Grab tempo if available.
                this.defaultTempo = event.data;
                this.setTempo(event.data);
              }

              if (event.hasOwnProperty('name') && event.name === 'Program Change') {
                if (!this.instruments.includes(event.value)) {
                  this.instruments.push(event.value);
                }
              }
            } else if (event) {
              if (event.hasOwnProperty('name') && event.name === 'Set Tempo') {
                // Grab tempo if available.
                this.setTempo(event.data);

                if (this.isPlaying()) {
                  this.pause().play();
                }
              }

              this.emitEvent(event);
            }
          }
        }, this);
        if (!dryRun) this.triggerPlayerEvent('playing', {
          tick: this.tick
        });
        this.inLoop = false;
      }
    }
    /**
     * Setter for tempo.
     * @param {number} - Tempo in bpm (defaults to 120)
     */

  }, {
    key: "setTempo",
    value: function setTempo(tempo) {
      this.tempo = tempo;
      return this;
    }
    /**
     * Setter for startTime.
     * @param {number} - UTC timestamp
     * @return {Player}
     */

  }, {
    key: "setStartTime",
    value: function setStartTime(startTime) {
      this.startTime = startTime;
      return this;
    }
    /**
     * Start playing loaded MIDI file if not already playing.
     * @return {Player}
     */

  }, {
    key: "play",
    value: function play() {
      if (this.isPlaying()) throw 'Already playing...'; // Initialize

      if (!this.startTime) this.startTime = new Date().getTime(); // Start play loop
      //window.requestAnimationFrame(this.playLoop.bind(this));

      this.setIntervalId = setInterval(this.playLoop.bind(this), this.sampleRate); //this.setIntervalId = this.loop();

      return this;
    }
  }, {
    key: "loop",
    value: function loop() {
      setTimeout(function () {
        // Do Something Here
        this.playLoop(); // Then recall the parent function to
        // create a recursive loop.

        this.loop();
      }.bind(this), this.sampleRate);
    }
    /**
     * Pauses playback if playing.
     * @return {Player}
     */

  }, {
    key: "pause",
    value: function pause() {
      clearInterval(this.setIntervalId);
      this.setIntervalId = false;
      this.startTick = this.tick;
      this.startTime = 0;
      return this;
    }
    /**
     * Stops playback if playing.
     * @return {Player}
     */

  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this.setIntervalId);
      this.setIntervalId = false;
      this.startTick = 0;
      this.startTime = 0;
      this.resetTracks();
      return this;
    }
    /**
     * Skips player pointer to specified tick.
     * @param {number} - Tick to skip to.
     * @return {Player}
     */

  }, {
    key: "skipToTick",
    value: function skipToTick(tick) {
      this.stop();
      this.startTick = tick; // Need to set track event indexes to the nearest possible event to the specified tick.

      this.tracks.forEach(function (track) {
        track.setEventIndexByTick(tick);
      });
      return this;
    }
    /**
     * Skips player pointer to specified percentage.
     * @param {number} - Percent value in integer format.
     * @return {Player}
     */

  }, {
    key: "skipToPercent",
    value: function skipToPercent(percent) {
      if (percent < 0 || percent > 100) throw "Percent must be number between 1 and 100.";
      this.skipToTick(Math.round(percent / 100 * this.totalTicks));
      return this;
    }
    /**
     * Skips player pointer to specified seconds.
     * @param {number} - Seconds to skip to.
     * @return {Player}
     */

  }, {
    key: "skipToSeconds",
    value: function skipToSeconds(seconds) {
      var songTime = this.getSongTime();
      if (seconds < 0 || seconds > songTime) throw seconds + " seconds not within song time of " + songTime;
      this.skipToPercent(seconds / songTime * 100);
      return this;
    }
    /**
     * Checks if player is playing
     * @return {boolean}
     */

  }, {
    key: "isPlaying",
    value: function isPlaying() {
      return this.setIntervalId > 0 || _typeof(this.setIntervalId) === 'object';
    }
    /**
     * Plays the loaded MIDI file without regard for timing and saves events in this.events.  Essentially used as a parser.
     * @return {Player}
     */

  }, {
    key: "dryRun",
    value: function dryRun() {
      // Reset tracks first
      this.resetTracks();

      while (!this.endOfFile()) {
        this.playLoop(true); //console.log(this.bytesProcessed(), this.midiChunksByteLength);
      }

      this.events = this.getEvents();
      this.totalEvents = this.getTotalEvents();
      this.totalTicks = this.getTotalTicks();
      this.startTick = 0;
      this.startTime = 0; // Leave tracks in pristine condish

      this.resetTracks(); //console.log('Song time: ' + this.getSongTime() + ' seconds / ' + this.totalTicks + ' ticks.');

      this.triggerPlayerEvent('fileLoaded', this);
      return this;
    }
    /**
     * Resets play pointers for all tracks.
     * @return {Player}
     */

  }, {
    key: "resetTracks",
    value: function resetTracks() {
      this.tracks.forEach(function (track) {
        return track.reset();
      });
      return this;
    }
    /**
     * Gets an array of events grouped by track.
     * @return {array}
     */

  }, {
    key: "getEvents",
    value: function getEvents() {
      return this.tracks.map(function (track) {
        return track.events;
      });
    }
    /**
     * Gets total number of ticks in the loaded MIDI file.
     * @return {number}
     */

  }, {
    key: "getTotalTicks",
    value: function getTotalTicks() {
      return Math.max.apply(null, this.tracks.map(function (track) {
        return track.delta;
      }));
    }
    /**
     * Gets total number of events in the loaded MIDI file.
     * @return {number}
     */

  }, {
    key: "getTotalEvents",
    value: function getTotalEvents() {
      return this.tracks.reduce(function (a, b) {
        return {
          events: {
            length: a.events.length + b.events.length
          }
        };
      }, {
        events: {
          length: 0
        }
      }).events.length;
    }
    /**
     * Gets song duration in seconds.
     * @return {number}
     */

  }, {
    key: "getSongTime",
    value: function getSongTime() {
      return this.totalTicks / this.division / this.tempo * 60;
    }
    /**
     * Gets remaining number of seconds in playback.
     * @return {number}
     */

  }, {
    key: "getSongTimeRemaining",
    value: function getSongTimeRemaining() {
      return Math.round((this.totalTicks - this.getCurrentTick()) / this.division / this.tempo * 60);
    }
    /**
     * Gets remaining percent of playback.
     * @return {number}
     */

  }, {
    key: "getSongPercentRemaining",
    value: function getSongPercentRemaining() {
      return Math.round(this.getSongTimeRemaining() / this.getSongTime() * 100);
    }
    /**
     * Number of bytes processed in the loaded MIDI file.
     * @return {number}
     */

  }, {
    key: "bytesProcessed",
    value: function bytesProcessed() {
      return Constants.HEADER_CHUNK_LENGTH + this.tracks.length * 8 + this.tracks.reduce(function (a, b) {
        return {
          pointer: a.pointer + b.pointer
        };
      }, {
        pointer: 0
      }).pointer;
    }
    /**
     * Number of events played up to this point.
     * @return {number}
     */

  }, {
    key: "eventsPlayed",
    value: function eventsPlayed() {
      return this.tracks.reduce(function (a, b) {
        return {
          eventIndex: a.eventIndex + b.eventIndex
        };
      }, {
        eventIndex: 0
      }).eventIndex;
    }
    /**
     * Determines if the player pointer has reached the end of the loaded MIDI file.
     * Used in two ways:
     * 1. If playing result is based on loaded JSON events.
     * 2. If parsing (dryRun) it's based on the actual buffer length vs bytes processed.
     * @return {boolean}
     */

  }, {
    key: "endOfFile",
    value: function endOfFile() {
      if (this.isPlaying()) {
        return this.totalTicks - this.tick <= 0;
      }

      return this.bytesProcessed() >= this.midiChunksByteLength; //this.buffer.length;
    }
    /**
     * Gets the current tick number in playback.
     * @return {number}
     */

  }, {
    key: "getCurrentTick",
    value: function getCurrentTick() {
      if (!this.startTime) return this.startTick;
      return Math.round((new Date().getTime() - this.startTime) / 1000 * (this.division * (this.tempo / 60))) + this.startTick;
    }
    /**
     * Sends MIDI event out to listener.
     * @param {object}
     * @return {Player}
     */

  }, {
    key: "emitEvent",
    value: function emitEvent(event) {
      this.triggerPlayerEvent('midiEvent', event);
      return this;
    }
    /**
     * Subscribes events to listeners
     * @param {string} - Name of event to subscribe to.
     * @param {function} - Callback to fire when event is broadcast.
     * @return {Player}
     */

  }, {
    key: "on",
    value: function on(playerEvent, fn) {
      if (!this.eventListeners.hasOwnProperty(playerEvent)) this.eventListeners[playerEvent] = [];
      this.eventListeners[playerEvent].push(fn);
      return this;
    }
    /**
     * Broadcasts event to trigger subscribed callbacks.
     * @param {string} - Name of event.
     * @param {object} - Data to be passed to subscriber callback.
     * @return {Player}
     */

  }, {
    key: "triggerPlayerEvent",
    value: function triggerPlayerEvent(playerEvent, data) {
      if (this.eventListeners.hasOwnProperty(playerEvent)) this.eventListeners[playerEvent].forEach(function (fn) {
        return fn(data || {});
      });
      return this;
    }
  }]);

  return Player;
}();

var index = {
  Player: Player,
  Utils: Utils,
  Constants: Constants
};




/***/ }),

/***/ 447:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const adler32       = __webpack_require__(269);
const crc32         = __webpack_require__(823);
const inflate_fast  = __webpack_require__(293);
const inflate_table = __webpack_require__(998);

const CODES = 0;
const LENS = 1;
const DISTS = 2;

/* Public constants ==========================================================*/
/* ===========================================================================*/

const {
  Z_FINISH, Z_BLOCK, Z_TREES,
  Z_OK, Z_STREAM_END, Z_NEED_DICT, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR,
  Z_DEFLATED
} = __webpack_require__(681);


/* STATES ====================================================================*/
/* ===========================================================================*/


const    HEAD = 16180;       /* i: waiting for magic header */
const    FLAGS = 16181;      /* i: waiting for method and flags (gzip) */
const    TIME = 16182;       /* i: waiting for modification time (gzip) */
const    OS = 16183;         /* i: waiting for extra flags and operating system (gzip) */
const    EXLEN = 16184;      /* i: waiting for extra length (gzip) */
const    EXTRA = 16185;      /* i: waiting for extra bytes (gzip) */
const    NAME = 16186;       /* i: waiting for end of file name (gzip) */
const    COMMENT = 16187;    /* i: waiting for end of comment (gzip) */
const    HCRC = 16188;       /* i: waiting for header crc (gzip) */
const    DICTID = 16189;    /* i: waiting for dictionary check value */
const    DICT = 16190;      /* waiting for inflateSetDictionary() call */
const        TYPE = 16191;      /* i: waiting for type bits, including last-flag bit */
const        TYPEDO = 16192;    /* i: same, but skip check to exit inflate on new block */
const        STORED = 16193;    /* i: waiting for stored size (length and complement) */
const        COPY_ = 16194;     /* i/o: same as COPY below, but only first time in */
const        COPY = 16195;      /* i/o: waiting for input or output to copy stored block */
const        TABLE = 16196;     /* i: waiting for dynamic block table lengths */
const        LENLENS = 16197;   /* i: waiting for code length code lengths */
const        CODELENS = 16198;  /* i: waiting for length/lit and distance code lengths */
const            LEN_ = 16199;      /* i: same as LEN below, but only first time in */
const            LEN = 16200;       /* i: waiting for length/lit/eob code */
const            LENEXT = 16201;    /* i: waiting for length extra bits */
const            DIST = 16202;      /* i: waiting for distance code */
const            DISTEXT = 16203;   /* i: waiting for distance extra bits */
const            MATCH = 16204;     /* o: waiting for output space to copy string */
const            LIT = 16205;       /* o: waiting for output space to write literal */
const    CHECK = 16206;     /* i: waiting for 32-bit check value */
const    LENGTH = 16207;    /* i: waiting for 32-bit length (gzip) */
const    DONE = 16208;      /* finished check, done -- remain here until reset */
const    BAD = 16209;       /* got a data error -- remain here until reset */
const    MEM = 16210;       /* got an inflate() memory error -- remain here until reset */
const    SYNC = 16211;      /* looking for synchronization bytes to restart inflate() */

/* ===========================================================================*/



const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
//const ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);

const MAX_WBITS = 15;
/* 32K LZ77 window */
const DEF_WBITS = MAX_WBITS;


const zswap32 = (q) => {

  return  (((q >>> 24) & 0xff) +
          ((q >>> 8) & 0xff00) +
          ((q & 0xff00) << 8) +
          ((q & 0xff) << 24));
};


function InflateState() {
  this.strm = null;           /* pointer back to this zlib stream */
  this.mode = 0;              /* current inflate mode */
  this.last = false;          /* true if processing last block */
  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip,
                                 bit 2 true to validate check value */
  this.havedict = false;      /* true if dictionary provided */
  this.flags = 0;             /* gzip header method and flags (0 if zlib), or
                                 -1 if raw or no header yet */
  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
  this.check = 0;             /* protected copy of check value */
  this.total = 0;             /* protected copy of output count */
  // TODO: may be {}
  this.head = null;           /* where to save gzip header information */

  /* sliding window */
  this.wbits = 0;             /* log base 2 of requested window size */
  this.wsize = 0;             /* window size or zero if not using window */
  this.whave = 0;             /* valid bytes in the window */
  this.wnext = 0;             /* window write index */
  this.window = null;         /* allocated sliding window, if needed */

  /* bit accumulator */
  this.hold = 0;              /* input bit accumulator */
  this.bits = 0;              /* number of bits in "in" */

  /* for string and stored block copying */
  this.length = 0;            /* literal or length of data to copy */
  this.offset = 0;            /* distance back to copy string from */

  /* for table and code decoding */
  this.extra = 0;             /* extra bits needed */

  /* fixed and dynamic code tables */
  this.lencode = null;          /* starting table for length/literal codes */
  this.distcode = null;         /* starting table for distance codes */
  this.lenbits = 0;           /* index bits for lencode */
  this.distbits = 0;          /* index bits for distcode */

  /* dynamic table building */
  this.ncode = 0;             /* number of code length code lengths */
  this.nlen = 0;              /* number of length code lengths */
  this.ndist = 0;             /* number of distance code lengths */
  this.have = 0;              /* number of code lengths in lens[] */
  this.next = null;              /* next available space in codes[] */

  this.lens = new Uint16Array(320); /* temporary storage for code lengths */
  this.work = new Uint16Array(288); /* work area for code table building */

  /*
   because we don't have pointers in js, we use lencode and distcode directly
   as buffers so we don't need codes
  */
  //this.codes = new Int32Array(ENOUGH);       /* space for code tables */
  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
  this.sane = 0;                   /* if false, allow invalid distance too far */
  this.back = 0;                   /* bits back of last unprocessed length/lit */
  this.was = 0;                    /* initial length of match */
}


const inflateStateCheck = (strm) => {

  if (!strm) {
    return 1;
  }
  const state = strm.state;
  if (!state || state.strm !== strm ||
    state.mode < HEAD || state.mode > SYNC) {
    return 1;
  }
  return 0;
};


const inflateResetKeep = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR; }
  const state = strm.state;
  strm.total_in = strm.total_out = state.total = 0;
  strm.msg = ''; /*Z_NULL*/
  if (state.wrap) {       /* to support ill-conceived Java test suite */
    strm.adler = state.wrap & 1;
  }
  state.mode = HEAD;
  state.last = 0;
  state.havedict = 0;
  state.flags = -1;
  state.dmax = 32768;
  state.head = null/*Z_NULL*/;
  state.hold = 0;
  state.bits = 0;
  //state.lencode = state.distcode = state.next = state.codes;
  state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
  state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);

  state.sane = 1;
  state.back = -1;
  //Tracev((stderr, "inflate: reset\n"));
  return Z_OK;
};


const inflateReset = (strm) => {

  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR; }
  const state = strm.state;
  state.wsize = 0;
  state.whave = 0;
  state.wnext = 0;
  return inflateResetKeep(strm);

};


const inflateReset2 = (strm, windowBits) => {
  let wrap;

  /* get the state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR; }
  const state = strm.state;

  /* extract wrap request from windowBits parameter */
  if (windowBits < 0) {
    wrap = 0;
    windowBits = -windowBits;
  }
  else {
    wrap = (windowBits >> 4) + 5;
    if (windowBits < 48) {
      windowBits &= 15;
    }
  }

  /* set number of window bits, free window if different */
  if (windowBits && (windowBits < 8 || windowBits > 15)) {
    return Z_STREAM_ERROR;
  }
  if (state.window !== null && state.wbits !== windowBits) {
    state.window = null;
  }

  /* update state and reset the rest of it */
  state.wrap = wrap;
  state.wbits = windowBits;
  return inflateReset(strm);
};


const inflateInit2 = (strm, windowBits) => {

  if (!strm) { return Z_STREAM_ERROR; }
  //strm.msg = Z_NULL;                 /* in case we return an error */

  const state = new InflateState();

  //if (state === Z_NULL) return Z_MEM_ERROR;
  //Tracev((stderr, "inflate: allocated\n"));
  strm.state = state;
  state.strm = strm;
  state.window = null/*Z_NULL*/;
  state.mode = HEAD;     /* to pass state test in inflateReset2() */
  const ret = inflateReset2(strm, windowBits);
  if (ret !== Z_OK) {
    strm.state = null/*Z_NULL*/;
  }
  return ret;
};


const inflateInit = (strm) => {

  return inflateInit2(strm, DEF_WBITS);
};


/*
 Return state with length and distance decoding tables and index sizes set to
 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
 If BUILDFIXED is defined, then instead this routine builds the tables the
 first time it's called, and returns those tables the first time and
 thereafter.  This reduces the size of the code by about 2K bytes, in
 exchange for a little execution time.  However, BUILDFIXED should not be
 used for threaded applications, since the rewriting of the tables and virgin
 may not be thread-safe.
 */
let virgin = true;

let lenfix, distfix; // We have no pointers in JS, so keep tables separate


const fixedtables = (state) => {

  /* build fixed huffman tables if first call (may not be thread safe) */
  if (virgin) {
    lenfix = new Int32Array(512);
    distfix = new Int32Array(32);

    /* literal/length table */
    let sym = 0;
    while (sym < 144) { state.lens[sym++] = 8; }
    while (sym < 256) { state.lens[sym++] = 9; }
    while (sym < 280) { state.lens[sym++] = 7; }
    while (sym < 288) { state.lens[sym++] = 8; }

    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });

    /* distance table */
    sym = 0;
    while (sym < 32) { state.lens[sym++] = 5; }

    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });

    /* do this just once */
    virgin = false;
  }

  state.lencode = lenfix;
  state.lenbits = 9;
  state.distcode = distfix;
  state.distbits = 5;
};


/*
 Update the window with the last wsize (normally 32K) bytes written before
 returning.  If window does not exist yet, create it.  This is only called
 when a window is already in use, or when output has been written during this
 inflate call, but the end of the deflate stream has not been reached yet.
 It is also called to create a window for dictionary data when a dictionary
 is loaded.

 Providing output buffers larger than 32K to inflate() should provide a speed
 advantage, since only the last 32K of output is copied to the sliding window
 upon return from inflate(), and since all distances after the first 32K of
 output will fall in the output data, making match copies simpler and faster.
 The advantage may be dependent on the size of the processor's data caches.
 */
const updatewindow = (strm, src, end, copy) => {

  let dist;
  const state = strm.state;

  /* if it hasn't been done already, allocate space for the window */
  if (state.window === null) {
    state.wsize = 1 << state.wbits;
    state.wnext = 0;
    state.whave = 0;

    state.window = new Uint8Array(state.wsize);
  }

  /* copy state->wsize or less output bytes into the circular window */
  if (copy >= state.wsize) {
    state.window.set(src.subarray(end - state.wsize, end), 0);
    state.wnext = 0;
    state.whave = state.wsize;
  }
  else {
    dist = state.wsize - state.wnext;
    if (dist > copy) {
      dist = copy;
    }
    //zmemcpy(state->window + state->wnext, end - copy, dist);
    state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
    copy -= dist;
    if (copy) {
      //zmemcpy(state->window, end - copy, copy);
      state.window.set(src.subarray(end - copy, end), 0);
      state.wnext = copy;
      state.whave = state.wsize;
    }
    else {
      state.wnext += dist;
      if (state.wnext === state.wsize) { state.wnext = 0; }
      if (state.whave < state.wsize) { state.whave += dist; }
    }
  }
  return 0;
};


const inflate = (strm, flush) => {

  let state;
  let input, output;          // input/output buffers
  let next;                   /* next input INDEX */
  let put;                    /* next output INDEX */
  let have, left;             /* available input and output */
  let hold;                   /* bit buffer */
  let bits;                   /* bits in bit buffer */
  let _in, _out;              /* save starting available input and output */
  let copy;                   /* number of stored or match bytes to copy */
  let from;                   /* where to copy match bytes from */
  let from_source;
  let here = 0;               /* current decoding table entry */
  let here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
  //let last;                   /* parent table entry */
  let last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
  let len;                    /* length to copy for repeats, bits to drop */
  let ret;                    /* return code */
  const hbuf = new Uint8Array(4);    /* buffer for gzip header crc calculation */
  let opts;

  let n; // temporary variable for NEED_BITS

  const order = /* permutation of code lengths */
    new Uint8Array([ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ]);


  if (inflateStateCheck(strm) || !strm.output ||
      (!strm.input && strm.avail_in !== 0)) {
    return Z_STREAM_ERROR;
  }

  state = strm.state;
  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */


  //--- LOAD() ---
  put = strm.next_out;
  output = strm.output;
  left = strm.avail_out;
  next = strm.next_in;
  input = strm.input;
  have = strm.avail_in;
  hold = state.hold;
  bits = state.bits;
  //---

  _in = have;
  _out = left;
  ret = Z_OK;

  inf_leave: // goto emulation
  for (;;) {
    switch (state.mode) {
      case HEAD:
        if (state.wrap === 0) {
          state.mode = TYPEDO;
          break;
        }
        //=== NEEDBITS(16);
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
          if (state.wbits === 0) {
            state.wbits = 15;
          }
          state.check = 0/*crc32(0L, Z_NULL, 0)*/;
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//

          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          state.mode = FLAGS;
          break;
        }
        if (state.head) {
          state.head.done = false;
        }
        if (!(state.wrap & 1) ||   /* check if zlib header allowed */
          (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
          strm.msg = 'incorrect header check';
          state.mode = BAD;
          break;
        }
        if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
        len = (hold & 0x0f)/*BITS(4)*/ + 8;
        if (state.wbits === 0) {
          state.wbits = len;
        }
        if (len > 15 || len > state.wbits) {
          strm.msg = 'invalid window size';
          state.mode = BAD;
          break;
        }

        // !!! pako patch. Force use `options.windowBits` if passed.
        // Required to always use max window size by default.
        state.dmax = 1 << state.wbits;
        //state.dmax = 1 << len;

        state.flags = 0;               /* indicate zlib header */
        //Tracev((stderr, "inflate:   zlib header ok\n"));
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = hold & 0x200 ? DICTID : TYPE;
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        break;
      case FLAGS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.flags = hold;
        if ((state.flags & 0xff) !== Z_DEFLATED) {
          strm.msg = 'unknown compression method';
          state.mode = BAD;
          break;
        }
        if (state.flags & 0xe000) {
          strm.msg = 'unknown header flags set';
          state.mode = BAD;
          break;
        }
        if (state.head) {
          state.head.text = ((hold >> 8) & 1);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = TIME;
        /* falls through */
      case TIME:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.time = hold;
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC4(state.check, hold)
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          hbuf[2] = (hold >>> 16) & 0xff;
          hbuf[3] = (hold >>> 24) & 0xff;
          state.check = crc32(state.check, hbuf, 4, 0);
          //===
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = OS;
        /* falls through */
      case OS:
        //=== NEEDBITS(16); */
        while (bits < 16) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if (state.head) {
          state.head.xflags = (hold & 0xff);
          state.head.os = (hold >> 8);
        }
        if ((state.flags & 0x0200) && (state.wrap & 4)) {
          //=== CRC2(state.check, hold);
          hbuf[0] = hold & 0xff;
          hbuf[1] = (hold >>> 8) & 0xff;
          state.check = crc32(state.check, hbuf, 2, 0);
          //===//
        }
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = EXLEN;
        /* falls through */
      case EXLEN:
        if (state.flags & 0x0400) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length = hold;
          if (state.head) {
            state.head.extra_len = hold;
          }
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            //=== CRC2(state.check, hold);
            hbuf[0] = hold & 0xff;
            hbuf[1] = (hold >>> 8) & 0xff;
            state.check = crc32(state.check, hbuf, 2, 0);
            //===//
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        else if (state.head) {
          state.head.extra = null/*Z_NULL*/;
        }
        state.mode = EXTRA;
        /* falls through */
      case EXTRA:
        if (state.flags & 0x0400) {
          copy = state.length;
          if (copy > have) { copy = have; }
          if (copy) {
            if (state.head) {
              len = state.head.extra_len - state.length;
              if (!state.head.extra) {
                // Use untyped array for more convenient processing later
                state.head.extra = new Uint8Array(state.head.extra_len);
              }
              state.head.extra.set(
                input.subarray(
                  next,
                  // extra field is limited to 65536 bytes
                  // - no need for additional size check
                  next + copy
                ),
                /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                len
              );
              //zmemcpy(state.head.extra + len, next,
              //        len + copy > state.head.extra_max ?
              //        state.head.extra_max - len : copy);
            }
            if ((state.flags & 0x0200) && (state.wrap & 4)) {
              state.check = crc32(state.check, input, copy, next);
            }
            have -= copy;
            next += copy;
            state.length -= copy;
          }
          if (state.length) { break inf_leave; }
        }
        state.length = 0;
        state.mode = NAME;
        /* falls through */
      case NAME:
        if (state.flags & 0x0800) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            // TODO: 2 or 1 bytes?
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.name_max*/)) {
              state.head.name += String.fromCharCode(len);
            }
          } while (len && copy < have);

          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.name = null;
        }
        state.length = 0;
        state.mode = COMMENT;
        /* falls through */
      case COMMENT:
        if (state.flags & 0x1000) {
          if (have === 0) { break inf_leave; }
          copy = 0;
          do {
            len = input[next + copy++];
            /* use constant limit because in js we should not preallocate memory */
            if (state.head && len &&
                (state.length < 65536 /*state.head.comm_max*/)) {
              state.head.comment += String.fromCharCode(len);
            }
          } while (len && copy < have);
          if ((state.flags & 0x0200) && (state.wrap & 4)) {
            state.check = crc32(state.check, input, copy, next);
          }
          have -= copy;
          next += copy;
          if (len) { break inf_leave; }
        }
        else if (state.head) {
          state.head.comment = null;
        }
        state.mode = HCRC;
        /* falls through */
      case HCRC:
        if (state.flags & 0x0200) {
          //=== NEEDBITS(16); */
          while (bits < 16) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.check & 0xffff)) {
            strm.msg = 'header crc mismatch';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
        }
        if (state.head) {
          state.head.hcrc = ((state.flags >> 9) & 1);
          state.head.done = true;
        }
        strm.adler = state.check = 0;
        state.mode = TYPE;
        break;
      case DICTID:
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        strm.adler = state.check = zswap32(hold);
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = DICT;
        /* falls through */
      case DICT:
        if (state.havedict === 0) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          return Z_NEED_DICT;
        }
        strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
        state.mode = TYPE;
        /* falls through */
      case TYPE:
        if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case TYPEDO:
        if (state.last) {
          //--- BYTEBITS() ---//
          hold >>>= bits & 7;
          bits -= bits & 7;
          //---//
          state.mode = CHECK;
          break;
        }
        //=== NEEDBITS(3); */
        while (bits < 3) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.last = (hold & 0x01)/*BITS(1)*/;
        //--- DROPBITS(1) ---//
        hold >>>= 1;
        bits -= 1;
        //---//

        switch ((hold & 0x03)/*BITS(2)*/) {
          case 0:                             /* stored block */
            //Tracev((stderr, "inflate:     stored block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = STORED;
            break;
          case 1:                             /* fixed block */
            fixedtables(state);
            //Tracev((stderr, "inflate:     fixed codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = LEN_;             /* decode codes */
            if (flush === Z_TREES) {
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
              break inf_leave;
            }
            break;
          case 2:                             /* dynamic block */
            //Tracev((stderr, "inflate:     dynamic codes block%s\n",
            //        state.last ? " (last)" : ""));
            state.mode = TABLE;
            break;
          case 3:
            strm.msg = 'invalid block type';
            state.mode = BAD;
        }
        //--- DROPBITS(2) ---//
        hold >>>= 2;
        bits -= 2;
        //---//
        break;
      case STORED:
        //--- BYTEBITS() ---// /* go to byte boundary */
        hold >>>= bits & 7;
        bits -= bits & 7;
        //---//
        //=== NEEDBITS(32); */
        while (bits < 32) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
          strm.msg = 'invalid stored block lengths';
          state.mode = BAD;
          break;
        }
        state.length = hold & 0xffff;
        //Tracev((stderr, "inflate:       stored length %u\n",
        //        state.length));
        //=== INITBITS();
        hold = 0;
        bits = 0;
        //===//
        state.mode = COPY_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case COPY_:
        state.mode = COPY;
        /* falls through */
      case COPY:
        copy = state.length;
        if (copy) {
          if (copy > have) { copy = have; }
          if (copy > left) { copy = left; }
          if (copy === 0) { break inf_leave; }
          //--- zmemcpy(put, next, copy); ---
          output.set(input.subarray(next, next + copy), put);
          //---//
          have -= copy;
          next += copy;
          left -= copy;
          put += copy;
          state.length -= copy;
          break;
        }
        //Tracev((stderr, "inflate:       stored end\n"));
        state.mode = TYPE;
        break;
      case TABLE:
        //=== NEEDBITS(14); */
        while (bits < 14) {
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
        }
        //===//
        state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
        //--- DROPBITS(5) ---//
        hold >>>= 5;
        bits -= 5;
        //---//
        state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
        //--- DROPBITS(4) ---//
        hold >>>= 4;
        bits -= 4;
        //---//
//#ifndef PKZIP_BUG_WORKAROUND
        if (state.nlen > 286 || state.ndist > 30) {
          strm.msg = 'too many length or distance symbols';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracev((stderr, "inflate:       table sizes ok\n"));
        state.have = 0;
        state.mode = LENLENS;
        /* falls through */
      case LENLENS:
        while (state.have < state.ncode) {
          //=== NEEDBITS(3);
          while (bits < 3) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
          //--- DROPBITS(3) ---//
          hold >>>= 3;
          bits -= 3;
          //---//
        }
        while (state.have < 19) {
          state.lens[order[state.have++]] = 0;
        }
        // We have separate tables & no pointers. 2 commented lines below not needed.
        //state.next = state.codes;
        //state.lencode = state.next;
        // Switch to use dynamic table
        state.lencode = state.lendyn;
        state.lenbits = 7;

        opts = { bits: state.lenbits };
        ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
        state.lenbits = opts.bits;

        if (ret) {
          strm.msg = 'invalid code lengths set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, "inflate:       code lengths ok\n"));
        state.have = 0;
        state.mode = CODELENS;
        /* falls through */
      case CODELENS:
        while (state.have < state.nlen + state.ndist) {
          for (;;) {
            here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          if (here_val < 16) {
            //--- DROPBITS(here.bits) ---//
            hold >>>= here_bits;
            bits -= here_bits;
            //---//
            state.lens[state.have++] = here_val;
          }
          else {
            if (here_val === 16) {
              //=== NEEDBITS(here.bits + 2);
              n = here_bits + 2;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              if (state.have === 0) {
                strm.msg = 'invalid bit length repeat';
                state.mode = BAD;
                break;
              }
              len = state.lens[state.have - 1];
              copy = 3 + (hold & 0x03);//BITS(2);
              //--- DROPBITS(2) ---//
              hold >>>= 2;
              bits -= 2;
              //---//
            }
            else if (here_val === 17) {
              //=== NEEDBITS(here.bits + 3);
              n = here_bits + 3;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 3 + (hold & 0x07);//BITS(3);
              //--- DROPBITS(3) ---//
              hold >>>= 3;
              bits -= 3;
              //---//
            }
            else {
              //=== NEEDBITS(here.bits + 7);
              n = here_bits + 7;
              while (bits < n) {
                if (have === 0) { break inf_leave; }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              //===//
              //--- DROPBITS(here.bits) ---//
              hold >>>= here_bits;
              bits -= here_bits;
              //---//
              len = 0;
              copy = 11 + (hold & 0x7f);//BITS(7);
              //--- DROPBITS(7) ---//
              hold >>>= 7;
              bits -= 7;
              //---//
            }
            if (state.have + copy > state.nlen + state.ndist) {
              strm.msg = 'invalid bit length repeat';
              state.mode = BAD;
              break;
            }
            while (copy--) {
              state.lens[state.have++] = len;
            }
          }
        }

        /* handle error breaks in while */
        if (state.mode === BAD) { break; }

        /* check for end-of-block code (better have one) */
        if (state.lens[256] === 0) {
          strm.msg = 'invalid code -- missing end-of-block';
          state.mode = BAD;
          break;
        }

        /* build code tables -- note: do not change the lenbits or distbits
           values here (9 and 6) without reading the comments in inftrees.h
           concerning the ENOUGH constants, which depend on those values */
        state.lenbits = 9;

        opts = { bits: state.lenbits };
        ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.lenbits = opts.bits;
        // state.lencode = state.next;

        if (ret) {
          strm.msg = 'invalid literal/lengths set';
          state.mode = BAD;
          break;
        }

        state.distbits = 6;
        //state.distcode.copy(state.codes);
        // Switch to use dynamic table
        state.distcode = state.distdyn;
        opts = { bits: state.distbits };
        ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
        // We have separate tables & no pointers. 2 commented lines below not needed.
        // state.next_index = opts.table_index;
        state.distbits = opts.bits;
        // state.distcode = state.next;

        if (ret) {
          strm.msg = 'invalid distances set';
          state.mode = BAD;
          break;
        }
        //Tracev((stderr, 'inflate:       codes ok\n'));
        state.mode = LEN_;
        if (flush === Z_TREES) { break inf_leave; }
        /* falls through */
      case LEN_:
        state.mode = LEN;
        /* falls through */
      case LEN:
        if (have >= 6 && left >= 258) {
          //--- RESTORE() ---
          strm.next_out = put;
          strm.avail_out = left;
          strm.next_in = next;
          strm.avail_in = have;
          state.hold = hold;
          state.bits = bits;
          //---
          inflate_fast(strm, _out);
          //--- LOAD() ---
          put = strm.next_out;
          output = strm.output;
          left = strm.avail_out;
          next = strm.next_in;
          input = strm.input;
          have = strm.avail_in;
          hold = state.hold;
          bits = state.bits;
          //---

          if (state.mode === TYPE) {
            state.back = -1;
          }
          break;
        }
        state.back = 0;
        for (;;) {
          here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if (here_bits <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if (here_op && (here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.lencode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        state.length = here_val;
        if (here_op === 0) {
          //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
          //        "inflate:         literal '%c'\n" :
          //        "inflate:         literal 0x%02x\n", here.val));
          state.mode = LIT;
          break;
        }
        if (here_op & 32) {
          //Tracevv((stderr, "inflate:         end of block\n"));
          state.back = -1;
          state.mode = TYPE;
          break;
        }
        if (here_op & 64) {
          strm.msg = 'invalid literal/length code';
          state.mode = BAD;
          break;
        }
        state.extra = here_op & 15;
        state.mode = LENEXT;
        /* falls through */
      case LENEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
        //Tracevv((stderr, "inflate:         length %u\n", state.length));
        state.was = state.length;
        state.mode = DIST;
        /* falls through */
      case DIST:
        for (;;) {
          here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
          here_bits = here >>> 24;
          here_op = (here >>> 16) & 0xff;
          here_val = here & 0xffff;

          if ((here_bits) <= bits) { break; }
          //--- PULLBYTE() ---//
          if (have === 0) { break inf_leave; }
          have--;
          hold += input[next++] << bits;
          bits += 8;
          //---//
        }
        if ((here_op & 0xf0) === 0) {
          last_bits = here_bits;
          last_op = here_op;
          last_val = here_val;
          for (;;) {
            here = state.distcode[last_val +
                    ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
            here_bits = here >>> 24;
            here_op = (here >>> 16) & 0xff;
            here_val = here & 0xffff;

            if ((last_bits + here_bits) <= bits) { break; }
            //--- PULLBYTE() ---//
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
            //---//
          }
          //--- DROPBITS(last.bits) ---//
          hold >>>= last_bits;
          bits -= last_bits;
          //---//
          state.back += last_bits;
        }
        //--- DROPBITS(here.bits) ---//
        hold >>>= here_bits;
        bits -= here_bits;
        //---//
        state.back += here_bits;
        if (here_op & 64) {
          strm.msg = 'invalid distance code';
          state.mode = BAD;
          break;
        }
        state.offset = here_val;
        state.extra = (here_op) & 15;
        state.mode = DISTEXT;
        /* falls through */
      case DISTEXT:
        if (state.extra) {
          //=== NEEDBITS(state.extra);
          n = state.extra;
          while (bits < n) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
          //--- DROPBITS(state.extra) ---//
          hold >>>= state.extra;
          bits -= state.extra;
          //---//
          state.back += state.extra;
        }
//#ifdef INFLATE_STRICT
        if (state.offset > state.dmax) {
          strm.msg = 'invalid distance too far back';
          state.mode = BAD;
          break;
        }
//#endif
        //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
        state.mode = MATCH;
        /* falls through */
      case MATCH:
        if (left === 0) { break inf_leave; }
        copy = _out - left;
        if (state.offset > copy) {         /* copy from window */
          copy = state.offset - copy;
          if (copy > state.whave) {
            if (state.sane) {
              strm.msg = 'invalid distance too far back';
              state.mode = BAD;
              break;
            }
// (!) This block is disabled in zlib defaults,
// don't enable it for binary compatibility
//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
//          Trace((stderr, "inflate.c too far\n"));
//          copy -= state.whave;
//          if (copy > state.length) { copy = state.length; }
//          if (copy > left) { copy = left; }
//          left -= copy;
//          state.length -= copy;
//          do {
//            output[put++] = 0;
//          } while (--copy);
//          if (state.length === 0) { state.mode = LEN; }
//          break;
//#endif
          }
          if (copy > state.wnext) {
            copy -= state.wnext;
            from = state.wsize - copy;
          }
          else {
            from = state.wnext - copy;
          }
          if (copy > state.length) { copy = state.length; }
          from_source = state.window;
        }
        else {                              /* copy from output */
          from_source = output;
          from = put - state.offset;
          copy = state.length;
        }
        if (copy > left) { copy = left; }
        left -= copy;
        state.length -= copy;
        do {
          output[put++] = from_source[from++];
        } while (--copy);
        if (state.length === 0) { state.mode = LEN; }
        break;
      case LIT:
        if (left === 0) { break inf_leave; }
        output[put++] = state.length;
        left--;
        state.mode = LEN;
        break;
      case CHECK:
        if (state.wrap) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            // Use '|' instead of '+' to make sure that result is signed
            hold |= input[next++] << bits;
            bits += 8;
          }
          //===//
          _out -= left;
          strm.total_out += _out;
          state.total += _out;
          if ((state.wrap & 4) && _out) {
            strm.adler = state.check =
                /*UPDATE_CHECK(state.check, put - _out, _out);*/
                (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));

          }
          _out = left;
          // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
          if ((state.wrap & 4) && (state.flags ? hold : zswap32(hold)) !== state.check) {
            strm.msg = 'incorrect data check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   check matches trailer\n"));
        }
        state.mode = LENGTH;
        /* falls through */
      case LENGTH:
        if (state.wrap && state.flags) {
          //=== NEEDBITS(32);
          while (bits < 32) {
            if (have === 0) { break inf_leave; }
            have--;
            hold += input[next++] << bits;
            bits += 8;
          }
          //===//
          if ((state.wrap & 4) && hold !== (state.total & 0xffffffff)) {
            strm.msg = 'incorrect length check';
            state.mode = BAD;
            break;
          }
          //=== INITBITS();
          hold = 0;
          bits = 0;
          //===//
          //Tracev((stderr, "inflate:   length matches trailer\n"));
        }
        state.mode = DONE;
        /* falls through */
      case DONE:
        ret = Z_STREAM_END;
        break inf_leave;
      case BAD:
        ret = Z_DATA_ERROR;
        break inf_leave;
      case MEM:
        return Z_MEM_ERROR;
      case SYNC:
        /* falls through */
      default:
        return Z_STREAM_ERROR;
    }
  }

  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"

  /*
     Return from inflate(), updating the total counts and the check value.
     If there was no progress during the inflate() call, return a buffer
     error.  Call updatewindow() to create and/or update the window state.
     Note: a memory error from inflate() is non-recoverable.
   */

  //--- RESTORE() ---
  strm.next_out = put;
  strm.avail_out = left;
  strm.next_in = next;
  strm.avail_in = have;
  state.hold = hold;
  state.bits = bits;
  //---

  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
                      (state.mode < CHECK || flush !== Z_FINISH))) {
    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
      state.mode = MEM;
      return Z_MEM_ERROR;
    }
  }
  _in -= strm.avail_in;
  _out -= strm.avail_out;
  strm.total_in += _in;
  strm.total_out += _out;
  state.total += _out;
  if ((state.wrap & 4) && _out) {
    strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
  }
  strm.data_type = state.bits + (state.last ? 64 : 0) +
                    (state.mode === TYPE ? 128 : 0) +
                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
    ret = Z_BUF_ERROR;
  }
  return ret;
};


const inflateEnd = (strm) => {

  if (inflateStateCheck(strm)) {
    return Z_STREAM_ERROR;
  }

  let state = strm.state;
  if (state.window) {
    state.window = null;
  }
  strm.state = null;
  return Z_OK;
};


const inflateGetHeader = (strm, head) => {

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR; }
  const state = strm.state;
  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }

  /* save header structure */
  state.head = head;
  head.done = false;
  return Z_OK;
};


const inflateSetDictionary = (strm, dictionary) => {
  const dictLength = dictionary.length;

  let state;
  let dictid;
  let ret;

  /* check state */
  if (inflateStateCheck(strm)) { return Z_STREAM_ERROR; }
  state = strm.state;

  if (state.wrap !== 0 && state.mode !== DICT) {
    return Z_STREAM_ERROR;
  }

  /* check for correct dictionary identifier */
  if (state.mode === DICT) {
    dictid = 1; /* adler32(0, null, 0)*/
    /* dictid = adler32(dictid, dictionary, dictLength); */
    dictid = adler32(dictid, dictionary, dictLength, 0);
    if (dictid !== state.check) {
      return Z_DATA_ERROR;
    }
  }
  /* copy dictionary to window using updatewindow(), which will amend the
   existing dictionary if appropriate */
  ret = updatewindow(strm, dictionary, dictLength, dictLength);
  if (ret) {
    state.mode = MEM;
    return Z_MEM_ERROR;
  }
  state.havedict = 1;
  // Tracev((stderr, "inflate:   dictionary set\n"));
  return Z_OK;
};


module.exports.inflateReset = inflateReset;
module.exports.inflateReset2 = inflateReset2;
module.exports.inflateResetKeep = inflateResetKeep;
module.exports.inflateInit = inflateInit;
module.exports.inflateInit2 = inflateInit2;
module.exports.inflate = inflate;
module.exports.inflateEnd = inflateEnd;
module.exports.inflateGetHeader = inflateGetHeader;
module.exports.inflateSetDictionary = inflateSetDictionary;
module.exports.inflateInfo = 'pako inflate (from Nodeca project)';

/* Not implemented
module.exports.inflateCodesUsed = inflateCodesUsed;
module.exports.inflateCopy = inflateCopy;
module.exports.inflateGetDictionary = inflateGetDictionary;
module.exports.inflateMark = inflateMark;
module.exports.inflatePrime = inflatePrime;
module.exports.inflateSync = inflateSync;
module.exports.inflateSyncPoint = inflateSyncPoint;
module.exports.inflateUndermine = inflateUndermine;
module.exports.inflateValidate = inflateValidate;
*/


/***/ }),

/***/ 463:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
var midi_player_js_1 = __importDefault(__webpack_require__(443));
var soundfont_player_1 = __importDefault(__webpack_require__(65));
// declare module 'midi.js' {
// declare namespace Midi {
//     interface MidiEvent {
//         deltaTime: number;
//         type: string;
//         subtype?: string;
//         channel?: number;
//         noteNumber?: number;
//         velocity?: number;
//         amount?: number;
//         controllerType?: number;
//         value?: number;
//         programNumber?: number;
//         text?: string;
//         number?: number;
//         microsecondsPerBeat?: number;
//         numerator?: number;
//         denominator?: number;
//         metronome?: number;
//         thirtyseconds?: number;
//         key?: number;
//         scale?: number;
//         data?: Uint8Array;
//         frameRate?: number;
//         hour?: number;
//         min?: number;
//         sec?: number;
//         frame?: number;
//         subframe?: number;
//     }
//     interface MidiHeader {
//         formatType: number;
//         trackCount: number;
//         ticksPerBeat: number;
//     }
//     interface MidiFile {
//         header: MidiHeader;
//         tracks: MidiEvent[][];
//     }
//     interface Generator {
//         alive: boolean;
//         released?: boolean;
//         generate(buf: number[], offset: number, count: number): void;
//         noteOff?(velocity?: number): void;
//     }
//     interface Program {
//         createNote(note: number, velocity: number): Generator;
//         attackAmplitude?: number;
//         sustainAmplitude?: number;
//         attackTime?: number;
//         decayTime?: number;
//         releaseTime?: number;
//     }
//     interface Replayer {
//         generate(samples: number): number[];
//         finished: boolean;
//     }
//     function MidiFile(data: ArrayBuffer): MidiFile;
//     function Replayer(midiFile: MidiFile): Replayer;
//     function setSampleRate(rate: number): void;
// }
// interface MidiPlayer {
//     isInited: boolean;
//     generator: Midi.Replayer | null;
//     midi: Midi.MidiFile | null;
//     isLoop: boolean;
//     node: ScriptProcessorNode | null;
//     context: AudioContext | null;
//     init(): void;
//     play(midiData: ArrayBuffer, isLoop: boolean): void;
//     stop(): void;
// }
// declare function MidiPlayer(): MidiPlayer;
// }
var Player = /** @class */ (function () {
    function Player() {
        var _this = this;
        this.isPlaying = false;
        // 获取DOM元素
        this.musicControl = document.getElementById('musicControl');
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        // 绑定事件
        this.playBtn.addEventListener('click', function () { return _this.play(); });
        this.stopBtn.addEventListener('click', function () { return _this.stop(); });
    }
    Player.prototype.setData = function (data, filename) {
        this.data = data;
        this.filename = filename;
    };
    // 加载并播放MIDI文件
    // public playMidi(midiData: ArrayBuffer): void {
    //     this.isPlaying = true;
    //     this.updateButtonStates();
    //     this.show();
    // }
    // 切换播放/暂停
    Player.prototype.togglePlay = function () {
        this.isPlaying = !this.isPlaying;
        this.updateButtonStates();
    };
    // 停止播放
    // private stop(): void {
    //     this.player.stop();
    //     this.isPlaying = false;
    //     this.updateButtonStates();
    // }
    // 更新按钮状态
    Player.prototype.updateButtonStates = function () {
        var playIcon = this.playBtn.querySelector('i');
        if (this.isPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
        }
        else {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
    };
    // 显示控制按钮
    Player.prototype.show = function () {
        this.musicControl.style.display = 'block';
    };
    // 隐藏控制按钮
    Player.prototype.hide = function () {
        this.musicControl.style.display = 'none';
    };
    /**
* 检查数据是否为有效的 MIDI 文件
* @param data 可能是 ArrayBuffer 或 Uint8Array 的数据
* @returns 如果是有效的 MIDI 文件返回 true，否则返回 false
*/
    Player.prototype.isMIDIFile = function (data) {
        // 如果是 ArrayBuffer，转换为 Uint8Array
        var uint8Data = data instanceof ArrayBuffer
            ? new Uint8Array(data)
            : data;
        if (!(uint8Data instanceof Uint8Array)) {
            return false;
        }
        if (uint8Data.length < 8) {
            return false;
        }
        // MIDI 文件必须以 "MThd" 字节开头 (ASCII: 77, 84, 104, 100)
        var midiHeader = new Uint8Array([77, 84, 104, 100]);
        // 比较前四个字节
        for (var i = 0; i < midiHeader.length; i++) {
            if (uint8Data[i] !== midiHeader[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * 检查数据是否为有效的 WAV 文件
     * @param data 可能是 ArrayBuffer 或 Uint8Array 的数据
     * @returns 如果是有效的 WAV 文件返回 true，否则返回 false
     */
    Player.prototype.isWAVFile = function (data) {
        // 如果是 ArrayBuffer，转换为 Uint8Array
        var uint8Data = data instanceof ArrayBuffer
            ? new Uint8Array(data)
            : data;
        if (!(uint8Data instanceof Uint8Array)) {
            return false;
        }
        if (uint8Data.length < 12) { // WAV 需要至少 12 字节检查
            return false;
        }
        // WAV 文件的前四个字节必须是 "RIFF" (ASCII: 82, 73, 70, 70)
        var riffHeader = new Uint8Array([82, 73, 70, 70]);
        // 比较前四个字节
        for (var i = 0; i < riffHeader.length; i++) {
            if (uint8Data[i] !== riffHeader[i]) {
                return false;
            }
        }
        // 检查 8-11 字节是否是 "WAVE" (ASCII: 87, 65, 86, 69)
        var waveHeader = new Uint8Array([87, 65, 86, 69]);
        for (var i = 8; i < 12; i++) {
            if (uint8Data[i] !== waveHeader[i - 8]) {
                return false;
            }
        }
        return true;
    };
    // 播放音乐
    Player.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1, isWav;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.show();
                        this.isPlaying = true;
                        this.updateButtonStates();
                        if (!this.isMIDIFile(this.data)) return [3 /*break*/, 5];
                        console.log("play midi..........");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // 初始化Web Audio Context
                        return [4 /*yield*/, this.setupAudioContext()];
                    case 2:
                        // 初始化Web Audio Context
                        _a.sent();
                        // 创建MIDI播放器
                        this.midiPlayer = new midi_player_js_1.default.Player();
                        // 加载MIDI数据
                        this.midiPlayer.loadArrayBuffer(this.data.buffer);
                        // 设置MIDI事件处理
                        this.midiPlayer.on('midiEvent', function (event) {
                            _this.handleMidiEvent(event);
                        });
                        // 播放
                        this.midiPlayer.play();
                        console.log("MIDI player started successfully");
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("MIDI playback failed:", error_1);
                        this.isPlaying = false;
                        this.updateButtonStates();
                        this.hide();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.log("play wav.........");
                        isWav = this.isWAVFile(this.data);
                        this.audio = new Audio(URL.createObjectURL(new Blob([new Uint8Array(this.data)], { type: isWav ? 'audio/wav' : 'audio/mp3' })));
                        this.audio.play();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // 停止播放
    Player.prototype.stop = function () {
        this.hide();
        this.isPlaying = false;
        this.updateButtonStates();
        if (this.midiPlayer) {
            this.midiPlayer.stop();
            this.midiPlayer = undefined;
        }
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0; // 重置音频到开始位置
            this.audio = undefined;
        }
    };
    // 设置Web Audio API上下文用于MIDI播放
    Player.prototype.setupAudioContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.audioContext = new AudioContext();
                        // 加载钢琴音源
                        _a = this;
                        return [4 /*yield*/, soundfont_player_1.default.instrument(this.audioContext, 'acoustic_grand_piano')];
                    case 1:
                        // 加载钢琴音源
                        _a.instrument = _b.sent();
                        console.log("Audio context and instrument loaded successfully");
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _b.sent();
                        console.error("Failed to setup audio context:", error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // 处理MIDI事件
    Player.prototype.handleMidiEvent = function (event) {
        if (!this.instrument)
            return;
        if (event.name === 'Note on') {
            this.instrument.play(event.noteName);
        }
        else if (event.name === 'Note off') {
            this.instrument.stop(event.noteName);
        }
    };
    return Player;
}());
exports.Player = Player;


/***/ }),

/***/ 621:
/***/ ((module) => {

var GBK = function (gbk_us) {
	var arr_index = 0x8140; //33088;
	var gbk = {
		decode: function (arr) {
			var str = "";
			for (var n = 0, max = arr.length; n < max; n++) {
				var code = arr[n] & 0xff;
				if (code > 0x80 && n + 1 < max) {
					var code1 = arr[n + 1] & 0xff;
					if(code1 >= 0x40){
						code = gbk_us[(code << 8 | code1) - arr_index]
						n++;
					}
				}
				str += String.fromCharCode(code);
			}
			return str;
		},
		encode: function (str) {
			str += '';
			var gbk = [];
			var wh = '?'.charCodeAt(0); //gbk中没有的字符的替换符
			for (var i = 0; i < str.length; i++) {
				var charcode = str.charCodeAt(i);
				if (charcode < 0x80) gbk.push(charcode)
				else {
					var gcode = gbk_us.indexOf(charcode);
					if (~gcode) {
						gcode += arr_index;
						gbk.push(0xFF & (gcode >> 8), 0xFF & gcode);
					} else {
						gbk.push(wh);
					}
				}
			}
			return gbk;
		}
	}
	return gbk;
};
module.exports = GBK;

/***/ }),

/***/ 635:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   acc: () => (/* binding */ acc),
/* harmony export */   alt: () => (/* binding */ alt),
/* harmony export */   build: () => (/* binding */ build),
/* harmony export */   chroma: () => (/* binding */ chroma),
/* harmony export */   freq: () => (/* binding */ freq),
/* harmony export */   letter: () => (/* binding */ letter),
/* harmony export */   midi: () => (/* binding */ midi),
/* harmony export */   oct: () => (/* binding */ oct),
/* harmony export */   parse: () => (/* binding */ parse),
/* harmony export */   pc: () => (/* binding */ pc),
/* harmony export */   regex: () => (/* binding */ regex),
/* harmony export */   step: () => (/* binding */ step)
/* harmony export */ });


// util
function fillStr (s, num) { return Array(num + 1).join(s) }
function isNum (x) { return typeof x === 'number' }
function isStr (x) { return typeof x === 'string' }
function isDef (x) { return typeof x !== 'undefined' }
function midiToFreq (midi, tuning) {
  return Math.pow(2, (midi - 69) / 12) * (tuning || 440)
}

var REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)\s*$/
/**
 * A regex for matching note strings in scientific notation.
 *
 * @name regex
 * @function
 * @return {RegExp} the regexp used to parse the note name
 *
 * The note string should have the form `letter[accidentals][octave][element]`
 * where:
 *
 * - letter: (Required) is a letter from A to G either upper or lower case
 * - accidentals: (Optional) can be one or more `b` (flats), `#` (sharps) or `x` (double sharps).
 * They can NOT be mixed.
 * - octave: (Optional) a positive or negative integer
 * - element: (Optional) additionally anything after the duration is considered to
 * be the element name (for example: 'C2 dorian')
 *
 * The executed regex contains (by array index):
 *
 * - 0: the complete string
 * - 1: the note letter
 * - 2: the optional accidentals
 * - 3: the optional octave
 * - 4: the rest of the string (trimmed)
 *
 * @example
 * var parser = require('note-parser')
 * parser.regex.exec('c#4')
 * // => ['c#4', 'c', '#', '4', '']
 * parser.regex.exec('c#4 major')
 * // => ['c#4major', 'c', '#', '4', 'major']
 * parser.regex().exec('CMaj7')
 * // => ['CMaj7', 'C', '', '', 'Maj7']
 */
function regex () { return REGEX }

var SEMITONES = [0, 2, 4, 5, 7, 9, 11]
/**
 * Parse a note name in scientific notation an return it's components,
 * and some numeric properties including midi number and frequency.
 *
 * @name parse
 * @function
 * @param {String} note - the note string to be parsed
 * @param {Boolean} isTonic - true the strings it's supposed to contain a note number
 * and some category (for example an scale: 'C# major'). It's false by default,
 * but when true, en extra tonicOf property is returned with the category ('major')
 * @param {Float} tunning - The frequency of A4 note to calculate frequencies.
 * By default it 440.
 * @return {Object} the parsed note name or null if not a valid note
 *
 * The parsed note name object will ALWAYS contains:
 * - letter: the uppercase letter of the note
 * - acc: the accidentals of the note (only sharps or flats)
 * - pc: the pitch class (letter + acc)
 * - step: s a numeric representation of the letter. It's an integer from 0 to 6
 * where 0 = C, 1 = D ... 6 = B
 * - alt: a numeric representation of the accidentals. 0 means no alteration,
 * positive numbers are for sharps and negative for flats
 * - chroma: a numeric representation of the pitch class. It's like midi for
 * pitch classes. 0 = C, 1 = C#, 2 = D ... 11 = B. Can be used to find enharmonics
 * since, for example, chroma of 'Cb' and 'B' are both 11
 *
 * If the note has octave, the parser object will contain:
 * - oct: the octave number (as integer)
 * - midi: the midi number
 * - freq: the frequency (using tuning parameter as base)
 *
 * If the parameter `isTonic` is set to true, the parsed object will contain:
 * - tonicOf: the rest of the string that follows note name (left and right trimmed)
 *
 * @example
 * var parse = require('note-parser').parse
 * parse('Cb4')
 * // => { letter: 'C', acc: 'b', pc: 'Cb', step: 0, alt: -1, chroma: -1,
 *         oct: 4, midi: 59, freq: 246.94165062806206 }
 * // if no octave, no midi, no freq
 * parse('fx')
 * // => { letter: 'F', acc: '##', pc: 'F##', step: 3, alt: 2, chroma: 7 })
 */
function parse (str, isTonic, tuning) {
  if (typeof str !== 'string') return null
  var m = REGEX.exec(str)
  if (!m || (!isTonic && m[4])) return null

  var p = { letter: m[1].toUpperCase(), acc: m[2].replace(/x/g, '##') }
  p.pc = p.letter + p.acc
  p.step = (p.letter.charCodeAt(0) + 3) % 7
  p.alt = p.acc[0] === 'b' ? -p.acc.length : p.acc.length
  var pos = SEMITONES[p.step] + p.alt
  p.chroma = pos < 0 ? 12 + pos : pos % 12
  if (m[3]) { // has octave
    p.oct = +m[3]
    p.midi = pos + 12 * (p.oct + 1)
    p.freq = midiToFreq(p.midi, tuning)
  }
  if (isTonic) p.tonicOf = m[4]
  return p
}

var LETTERS = 'CDEFGAB'
function accStr (n) { return !isNum(n) ? '' : n < 0 ? fillStr('b', -n) : fillStr('#', n) }
function octStr (n) { return !isNum(n) ? '' : '' + n }

/**
 * Create a string from a parsed object or `step, alteration, octave` parameters
 * @param {Object} obj - the parsed data object
 * @return {String} a note string or null if not valid parameters
 * @since 1.2
 * @example
 * parser.build(parser.parse('cb2')) // => 'Cb2'
 *
 * @example
 * // it accepts (step, alteration, octave) parameters:
 * parser.build(3) // => 'F'
 * parser.build(3, -1) // => 'Fb'
 * parser.build(3, -1, 4) // => 'Fb4'
 */
function build (s, a, o) {
  if (s === null || typeof s === 'undefined') return null
  if (s.step) return build(s.step, s.alt, s.oct)
  if (s < 0 || s > 6) return null
  return LETTERS.charAt(s) + accStr(a) + octStr(o)
}

/**
 * Get midi of a note
 *
 * @name midi
 * @function
 * @param {String|Integer} note - the note name or midi number
 * @return {Integer} the midi number of the note or null if not a valid note
 * or the note does NOT contains octave
 * @example
 * var parser = require('note-parser')
 * parser.midi('A4') // => 69
 * parser.midi('A') // => null
 * @example
 * // midi numbers are bypassed (even as strings)
 * parser.midi(60) // => 60
 * parser.midi('60') // => 60
 */
function midi (note) {
  if ((isNum(note) || isStr(note)) && note >= 0 && note < 128) return +note
  var p = parse(note)
  return p && isDef(p.midi) ? p.midi : null
}

/**
 * Get freq of a note in hertzs (in a well tempered 440Hz A4)
 *
 * @name freq
 * @function
 * @param {String} note - the note name or note midi number
 * @param {String} tuning - (Optional) the A4 frequency (440 by default)
 * @return {Float} the freq of the number if hertzs or null if not valid note
 * @example
 * var parser = require('note-parser')
 * parser.freq('A4') // => 440
 * parser.freq('A') // => null
 * @example
 * // can change tuning (440 by default)
 * parser.freq('A4', 444) // => 444
 * parser.freq('A3', 444) // => 222
 * @example
 * // it accepts midi numbers (as numbers and as strings)
 * parser.freq(69) // => 440
 * parser.freq('69', 442) // => 442
 */
function freq (note, tuning) {
  var m = midi(note)
  return m === null ? null : midiToFreq(m, tuning)
}

function letter (src) { return (parse(src) || {}).letter }
function acc (src) { return (parse(src) || {}).acc }
function pc (src) { return (parse(src) || {}).pc }
function step (src) { return (parse(src) || {}).step }
function alt (src) { return (parse(src) || {}).alt }
function chroma (src) { return (parse(src) || {}).chroma }
function oct (src) { return (parse(src) || {}).oct }


/***/ }),

/***/ 655:
/***/ ((module) => {

"use strict";
/* global XMLHttpRequest */


/**
 * Given a url and a return type, returns a promise to the content of the url
 * Basically it wraps a XMLHttpRequest into a Promise
 *
 * @param {String} url
 * @param {String} type - can be 'text' or 'arraybuffer'
 * @return {Promise}
 */
module.exports = function (url, type) {
  return new Promise(function (done, reject) {
    var req = new XMLHttpRequest()
    if (type) req.responseType = type

    req.open('GET', url)
    req.onload = function () {
      req.status === 200 ? done(req.response) : reject(Error(req.statusText))
    }
    req.onerror = function () { reject(Error('Network Error')) }
    req.send()
  })
}


/***/ }),

/***/ 665:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

/* eslint-disable space-unary-ops */

/* Public constants ==========================================================*/
/* ===========================================================================*/


//const Z_FILTERED          = 1;
//const Z_HUFFMAN_ONLY      = 2;
//const Z_RLE               = 3;
const Z_FIXED               = 4;
//const Z_DEFAULT_STRATEGY  = 0;

/* Possible values of the data_type field (though see inflate()) */
const Z_BINARY              = 0;
const Z_TEXT                = 1;
//const Z_ASCII             = 1; // = Z_TEXT
const Z_UNKNOWN             = 2;

/*============================================================================*/


function zero(buf) { let len = buf.length; while (--len >= 0) { buf[len] = 0; } }

// From zutil.h

const STORED_BLOCK = 0;
const STATIC_TREES = 1;
const DYN_TREES    = 2;
/* The three kinds of block type */

const MIN_MATCH    = 3;
const MAX_MATCH    = 258;
/* The minimum and maximum match lengths */

// From deflate.h
/* ===========================================================================
 * Internal compression state.
 */

const LENGTH_CODES  = 29;
/* number of length codes, not counting the special END_BLOCK code */

const LITERALS      = 256;
/* number of literal bytes 0..255 */

const L_CODES       = LITERALS + 1 + LENGTH_CODES;
/* number of Literal or Length codes, including the END_BLOCK code */

const D_CODES       = 30;
/* number of distance codes */

const BL_CODES      = 19;
/* number of codes used to transfer the bit lengths */

const HEAP_SIZE     = 2 * L_CODES + 1;
/* maximum heap size */

const MAX_BITS      = 15;
/* All codes must not exceed MAX_BITS bits */

const Buf_size      = 16;
/* size of bit buffer in bi_buf */


/* ===========================================================================
 * Constants
 */

const MAX_BL_BITS = 7;
/* Bit length codes must not exceed MAX_BL_BITS bits */

const END_BLOCK   = 256;
/* end of block literal code */

const REP_3_6     = 16;
/* repeat previous bit length 3-6 times (2 bits of repeat count) */

const REPZ_3_10   = 17;
/* repeat a zero length 3-10 times  (3 bits of repeat count) */

const REPZ_11_138 = 18;
/* repeat a zero length 11-138 times  (7 bits of repeat count) */

/* eslint-disable comma-spacing,array-bracket-spacing */
const extra_lbits =   /* extra bits for each length code */
  new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]);

const extra_dbits =   /* extra bits for each distance code */
  new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);

const extra_blbits =  /* extra bits for each bit length code */
  new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);

const bl_order =
  new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);
/* eslint-enable comma-spacing,array-bracket-spacing */

/* The lengths of the bit length codes are sent in order of decreasing
 * probability, to avoid transmitting the lengths for unused bit length codes.
 */

/* ===========================================================================
 * Local data. These are initialized only once.
 */

// We pre-fill arrays with 0 to avoid uninitialized gaps

const DIST_CODE_LEN = 512; /* see definition of array dist_code below */

// !!!! Use flat array instead of structure, Freq = i*2, Len = i*2+1
const static_ltree  = new Array((L_CODES + 2) * 2);
zero(static_ltree);
/* The static literal tree. Since the bit lengths are imposed, there is no
 * need for the L_CODES extra codes used during heap construction. However
 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
 * below).
 */

const static_dtree  = new Array(D_CODES * 2);
zero(static_dtree);
/* The static distance tree. (Actually a trivial tree since all codes use
 * 5 bits.)
 */

const _dist_code    = new Array(DIST_CODE_LEN);
zero(_dist_code);
/* Distance codes. The first 256 values correspond to the distances
 * 3 .. 258, the last 256 values correspond to the top 8 bits of
 * the 15 bit distances.
 */

const _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
zero(_length_code);
/* length code for each normalized match length (0 == MIN_MATCH) */

const base_length   = new Array(LENGTH_CODES);
zero(base_length);
/* First normalized length for each code (0 = MIN_MATCH) */

const base_dist     = new Array(D_CODES);
zero(base_dist);
/* First normalized distance for each code (0 = distance of 1) */


function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {

  this.static_tree  = static_tree;  /* static tree or NULL */
  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
  this.extra_base   = extra_base;   /* base index for extra_bits */
  this.elems        = elems;        /* max number of elements in the tree */
  this.max_length   = max_length;   /* max bit length for the codes */

  // show if `static_tree` has data or dummy - needed for monomorphic objects
  this.has_stree    = static_tree && static_tree.length;
}


let static_l_desc;
let static_d_desc;
let static_bl_desc;


function TreeDesc(dyn_tree, stat_desc) {
  this.dyn_tree = dyn_tree;     /* the dynamic tree */
  this.max_code = 0;            /* largest code with non zero frequency */
  this.stat_desc = stat_desc;   /* the corresponding static tree */
}



const d_code = (dist) => {

  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
};


/* ===========================================================================
 * Output a short LSB first on the stream.
 * IN assertion: there is enough room in pendingBuf.
 */
const put_short = (s, w) => {
//    put_byte(s, (uch)((w) & 0xff));
//    put_byte(s, (uch)((ush)(w) >> 8));
  s.pending_buf[s.pending++] = (w) & 0xff;
  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
};


/* ===========================================================================
 * Send a value on a given number of bits.
 * IN assertion: length <= 16 and value fits in length bits.
 */
const send_bits = (s, value, length) => {

  if (s.bi_valid > (Buf_size - length)) {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    put_short(s, s.bi_buf);
    s.bi_buf = value >> (Buf_size - s.bi_valid);
    s.bi_valid += length - Buf_size;
  } else {
    s.bi_buf |= (value << s.bi_valid) & 0xffff;
    s.bi_valid += length;
  }
};


const send_code = (s, c, tree) => {

  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
};


/* ===========================================================================
 * Reverse the first len bits of a code, using straightforward code (a faster
 * method would use a table)
 * IN assertion: 1 <= len <= 15
 */
const bi_reverse = (code, len) => {

  let res = 0;
  do {
    res |= code & 1;
    code >>>= 1;
    res <<= 1;
  } while (--len > 0);
  return res >>> 1;
};


/* ===========================================================================
 * Flush the bit buffer, keeping at most 7 bits in it.
 */
const bi_flush = (s) => {

  if (s.bi_valid === 16) {
    put_short(s, s.bi_buf);
    s.bi_buf = 0;
    s.bi_valid = 0;

  } else if (s.bi_valid >= 8) {
    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
    s.bi_buf >>= 8;
    s.bi_valid -= 8;
  }
};


/* ===========================================================================
 * Compute the optimal bit lengths for a tree and update the total bit length
 * for the current block.
 * IN assertion: the fields freq and dad are set, heap[heap_max] and
 *    above are the tree nodes sorted by increasing frequency.
 * OUT assertions: the field len is set to the optimal bit length, the
 *     array bl_count contains the frequencies for each bit length.
 *     The length opt_len is updated; static_len is also updated if stree is
 *     not null.
 */
const gen_bitlen = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc;    /* the tree descriptor */

  const tree            = desc.dyn_tree;
  const max_code        = desc.max_code;
  const stree           = desc.stat_desc.static_tree;
  const has_stree       = desc.stat_desc.has_stree;
  const extra           = desc.stat_desc.extra_bits;
  const base            = desc.stat_desc.extra_base;
  const max_length      = desc.stat_desc.max_length;
  let h;              /* heap index */
  let n, m;           /* iterate over the tree elements */
  let bits;           /* bit length */
  let xbits;          /* extra bits */
  let f;              /* frequency */
  let overflow = 0;   /* number of elements with bit length too large */

  for (bits = 0; bits <= MAX_BITS; bits++) {
    s.bl_count[bits] = 0;
  }

  /* In a first pass, compute the optimal bit lengths (which may
   * overflow in the case of the bit length tree).
   */
  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */

  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
    n = s.heap[h];
    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
    if (bits > max_length) {
      bits = max_length;
      overflow++;
    }
    tree[n * 2 + 1]/*.Len*/ = bits;
    /* We overwrite tree[n].Dad which is no longer needed */

    if (n > max_code) { continue; } /* not a leaf node */

    s.bl_count[bits]++;
    xbits = 0;
    if (n >= base) {
      xbits = extra[n - base];
    }
    f = tree[n * 2]/*.Freq*/;
    s.opt_len += f * (bits + xbits);
    if (has_stree) {
      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
    }
  }
  if (overflow === 0) { return; }

  // Tracev((stderr,"\nbit length overflow\n"));
  /* This happens for example on obj2 and pic of the Calgary corpus */

  /* Find the first bit length which could increase: */
  do {
    bits = max_length - 1;
    while (s.bl_count[bits] === 0) { bits--; }
    s.bl_count[bits]--;      /* move one leaf down the tree */
    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
    s.bl_count[max_length]--;
    /* The brother of the overflow item also moves one step up,
     * but this does not affect bl_count[max_length]
     */
    overflow -= 2;
  } while (overflow > 0);

  /* Now recompute all bit lengths, scanning in increasing frequency.
   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
   * lengths instead of fixing only the wrong ones. This idea is taken
   * from 'ar' written by Haruhiko Okumura.)
   */
  for (bits = max_length; bits !== 0; bits--) {
    n = s.bl_count[bits];
    while (n !== 0) {
      m = s.heap[--h];
      if (m > max_code) { continue; }
      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
        // Tracev((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
        tree[m * 2 + 1]/*.Len*/ = bits;
      }
      n--;
    }
  }
};


/* ===========================================================================
 * Generate the codes for a given tree and bit counts (which need not be
 * optimal).
 * IN assertion: the array bl_count contains the bit length statistics for
 * the given tree and the field len is set for all tree elements.
 * OUT assertion: the field code is set for all tree elements of non
 *     zero code length.
 */
const gen_codes = (tree, max_code, bl_count) => {
//    ct_data *tree;             /* the tree to decorate */
//    int max_code;              /* largest code with non zero frequency */
//    ushf *bl_count;            /* number of codes at each bit length */

  const next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
  let code = 0;              /* running code value */
  let bits;                  /* bit index */
  let n;                     /* code index */

  /* The distribution counts are first used to generate the code values
   * without bit reversal.
   */
  for (bits = 1; bits <= MAX_BITS; bits++) {
    code = (code + bl_count[bits - 1]) << 1;
    next_code[bits] = code;
  }
  /* Check that the bit counts in bl_count are consistent. The last code
   * must be all ones.
   */
  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
  //        "inconsistent bit counts");
  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));

  for (n = 0;  n <= max_code; n++) {
    let len = tree[n * 2 + 1]/*.Len*/;
    if (len === 0) { continue; }
    /* Now reverse the bits */
    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);

    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
  }
};


/* ===========================================================================
 * Initialize the various 'constant' tables.
 */
const tr_static_init = () => {

  let n;        /* iterates over tree elements */
  let bits;     /* bit counter */
  let length;   /* length value */
  let code;     /* code value */
  let dist;     /* distance index */
  const bl_count = new Array(MAX_BITS + 1);
  /* number of codes at each bit length for an optimal tree */

  // do check in _tr_init()
  //if (static_init_done) return;

  /* For some embedded targets, global variables are not initialized: */
/*#ifdef NO_INIT_GLOBAL_POINTERS
  static_l_desc.static_tree = static_ltree;
  static_l_desc.extra_bits = extra_lbits;
  static_d_desc.static_tree = static_dtree;
  static_d_desc.extra_bits = extra_dbits;
  static_bl_desc.extra_bits = extra_blbits;
#endif*/

  /* Initialize the mapping length (0..255) -> length code (0..28) */
  length = 0;
  for (code = 0; code < LENGTH_CODES - 1; code++) {
    base_length[code] = length;
    for (n = 0; n < (1 << extra_lbits[code]); n++) {
      _length_code[length++] = code;
    }
  }
  //Assert (length == 256, "tr_static_init: length != 256");
  /* Note that the length 255 (match length 258) can be represented
   * in two different ways: code 284 + 5 bits or code 285, so we
   * overwrite length_code[255] to use the best encoding:
   */
  _length_code[length - 1] = code;

  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
  dist = 0;
  for (code = 0; code < 16; code++) {
    base_dist[code] = dist;
    for (n = 0; n < (1 << extra_dbits[code]); n++) {
      _dist_code[dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: dist != 256");
  dist >>= 7; /* from now on, all distances are divided by 128 */
  for (; code < D_CODES; code++) {
    base_dist[code] = dist << 7;
    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
      _dist_code[256 + dist++] = code;
    }
  }
  //Assert (dist == 256, "tr_static_init: 256+dist != 512");

  /* Construct the codes of the static literal tree */
  for (bits = 0; bits <= MAX_BITS; bits++) {
    bl_count[bits] = 0;
  }

  n = 0;
  while (n <= 143) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  while (n <= 255) {
    static_ltree[n * 2 + 1]/*.Len*/ = 9;
    n++;
    bl_count[9]++;
  }
  while (n <= 279) {
    static_ltree[n * 2 + 1]/*.Len*/ = 7;
    n++;
    bl_count[7]++;
  }
  while (n <= 287) {
    static_ltree[n * 2 + 1]/*.Len*/ = 8;
    n++;
    bl_count[8]++;
  }
  /* Codes 286 and 287 do not exist, but we must include them in the
   * tree construction to get a canonical Huffman tree (longest code
   * all ones)
   */
  gen_codes(static_ltree, L_CODES + 1, bl_count);

  /* The static distance tree is trivial: */
  for (n = 0; n < D_CODES; n++) {
    static_dtree[n * 2 + 1]/*.Len*/ = 5;
    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
  }

  // Now data ready and we can init static trees
  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);

  //static_init_done = true;
};


/* ===========================================================================
 * Initialize a new block.
 */
const init_block = (s) => {

  let n; /* iterates over tree elements */

  /* Initialize the trees. */
  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }

  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
  s.opt_len = s.static_len = 0;
  s.sym_next = s.matches = 0;
};


/* ===========================================================================
 * Flush the bit buffer and align the output on a byte boundary
 */
const bi_windup = (s) =>
{
  if (s.bi_valid > 8) {
    put_short(s, s.bi_buf);
  } else if (s.bi_valid > 0) {
    //put_byte(s, (Byte)s->bi_buf);
    s.pending_buf[s.pending++] = s.bi_buf;
  }
  s.bi_buf = 0;
  s.bi_valid = 0;
};

/* ===========================================================================
 * Compares to subtrees, using the tree depth as tie breaker when
 * the subtrees have equal frequency. This minimizes the worst case length.
 */
const smaller = (tree, n, m, depth) => {

  const _n2 = n * 2;
  const _m2 = m * 2;
  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
};

/* ===========================================================================
 * Restore the heap property by moving down the tree starting at node k,
 * exchanging a node with the smallest of its two sons if necessary, stopping
 * when the heap property is re-established (each father smaller than its
 * two sons).
 */
const pqdownheap = (s, tree, k) => {
//    deflate_state *s;
//    ct_data *tree;  /* the tree to restore */
//    int k;               /* node to move down */

  const v = s.heap[k];
  let j = k << 1;  /* left son of k */
  while (j <= s.heap_len) {
    /* Set j to the smallest of the two sons: */
    if (j < s.heap_len &&
      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
      j++;
    }
    /* Exit if v is smaller than both sons */
    if (smaller(tree, v, s.heap[j], s.depth)) { break; }

    /* Exchange v with the smallest son */
    s.heap[k] = s.heap[j];
    k = j;

    /* And continue down the tree, setting j to the left son of k */
    j <<= 1;
  }
  s.heap[k] = v;
};


// inlined manually
// const SMALLEST = 1;

/* ===========================================================================
 * Send the block data compressed using the given Huffman trees
 */
const compress_block = (s, ltree, dtree) => {
//    deflate_state *s;
//    const ct_data *ltree; /* literal tree */
//    const ct_data *dtree; /* distance tree */

  let dist;           /* distance of matched string */
  let lc;             /* match length or unmatched char (if dist == 0) */
  let sx = 0;         /* running index in sym_buf */
  let code;           /* the code to send */
  let extra;          /* number of extra bits to send */

  if (s.sym_next !== 0) {
    do {
      dist = s.pending_buf[s.sym_buf + sx++] & 0xff;
      dist += (s.pending_buf[s.sym_buf + sx++] & 0xff) << 8;
      lc = s.pending_buf[s.sym_buf + sx++];
      if (dist === 0) {
        send_code(s, lc, ltree); /* send a literal byte */
        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
      } else {
        /* Here, lc is the match length - MIN_MATCH */
        code = _length_code[lc];
        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
        extra = extra_lbits[code];
        if (extra !== 0) {
          lc -= base_length[code];
          send_bits(s, lc, extra);       /* send the extra length bits */
        }
        dist--; /* dist is now the match distance - 1 */
        code = d_code(dist);
        //Assert (code < D_CODES, "bad d_code");

        send_code(s, code, dtree);       /* send the distance code */
        extra = extra_dbits[code];
        if (extra !== 0) {
          dist -= base_dist[code];
          send_bits(s, dist, extra);   /* send the extra distance bits */
        }
      } /* literal or match pair ? */

      /* Check that the overlay between pending_buf and sym_buf is ok: */
      //Assert(s->pending < s->lit_bufsize + sx, "pendingBuf overflow");

    } while (sx < s.sym_next);
  }

  send_code(s, END_BLOCK, ltree);
};


/* ===========================================================================
 * Construct one Huffman tree and assigns the code bit strings and lengths.
 * Update the total bit length for the current block.
 * IN assertion: the field freq is set for all tree elements.
 * OUT assertions: the fields len and code are set to the optimal bit length
 *     and corresponding code. The length opt_len is updated; static_len is
 *     also updated if stree is not null. The field max_code is set.
 */
const build_tree = (s, desc) => {
//    deflate_state *s;
//    tree_desc *desc; /* the tree descriptor */

  const tree     = desc.dyn_tree;
  const stree    = desc.stat_desc.static_tree;
  const has_stree = desc.stat_desc.has_stree;
  const elems    = desc.stat_desc.elems;
  let n, m;          /* iterate over heap elements */
  let max_code = -1; /* largest code with non zero frequency */
  let node;          /* new node being created */

  /* Construct the initial heap, with least frequent element in
   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
   * heap[0] is not used.
   */
  s.heap_len = 0;
  s.heap_max = HEAP_SIZE;

  for (n = 0; n < elems; n++) {
    if (tree[n * 2]/*.Freq*/ !== 0) {
      s.heap[++s.heap_len] = max_code = n;
      s.depth[n] = 0;

    } else {
      tree[n * 2 + 1]/*.Len*/ = 0;
    }
  }

  /* The pkzip format requires that at least one distance code exists,
   * and that at least one bit should be sent even if there is only one
   * possible code. So to avoid special checks later on we force at least
   * two codes of non zero frequency.
   */
  while (s.heap_len < 2) {
    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
    tree[node * 2]/*.Freq*/ = 1;
    s.depth[node] = 0;
    s.opt_len--;

    if (has_stree) {
      s.static_len -= stree[node * 2 + 1]/*.Len*/;
    }
    /* node is 0 or 1 so it does not have extra bits */
  }
  desc.max_code = max_code;

  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
   * establish sub-heaps of increasing lengths:
   */
  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }

  /* Construct the Huffman tree by repeatedly combining the least two
   * frequent nodes.
   */
  node = elems;              /* next internal node of the tree */
  do {
    //pqremove(s, tree, n);  /* n = node of least frequency */
    /*** pqremove ***/
    n = s.heap[1/*SMALLEST*/];
    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
    pqdownheap(s, tree, 1/*SMALLEST*/);
    /***/

    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */

    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
    s.heap[--s.heap_max] = m;

    /* Create a new node father of n and m */
    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;

    /* and insert the new node in the heap */
    s.heap[1/*SMALLEST*/] = node++;
    pqdownheap(s, tree, 1/*SMALLEST*/);

  } while (s.heap_len >= 2);

  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];

  /* At this point, the fields freq and dad are set. We can now
   * generate the bit lengths.
   */
  gen_bitlen(s, desc);

  /* The field len is now set, we can generate the bit codes */
  gen_codes(tree, max_code, s.bl_count);
};


/* ===========================================================================
 * Scan a literal or distance tree to determine the frequencies of the codes
 * in the bit length tree.
 */
const scan_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree;   /* the tree to be scanned */
//    int max_code;    /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }
  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      s.bl_tree[curlen * 2]/*.Freq*/ += count;

    } else if (curlen !== 0) {

      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;

    } else if (count <= 10) {
      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;

    } else {
      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
    }

    count = 0;
    prevlen = curlen;

    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Send a literal or distance tree in compressed form, using the codes in
 * bl_tree.
 */
const send_tree = (s, tree, max_code) => {
//    deflate_state *s;
//    ct_data *tree; /* the tree to be scanned */
//    int max_code;       /* and its largest code of non zero frequency */

  let n;                     /* iterates over all tree elements */
  let prevlen = -1;          /* last emitted length */
  let curlen;                /* length of current code */

  let nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */

  let count = 0;             /* repeat count of the current code */
  let max_count = 7;         /* max repeat count */
  let min_count = 4;         /* min repeat count */

  /* tree[max_code+1].Len = -1; */  /* guard already set */
  if (nextlen === 0) {
    max_count = 138;
    min_count = 3;
  }

  for (n = 0; n <= max_code; n++) {
    curlen = nextlen;
    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;

    if (++count < max_count && curlen === nextlen) {
      continue;

    } else if (count < min_count) {
      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);

    } else if (curlen !== 0) {
      if (curlen !== prevlen) {
        send_code(s, curlen, s.bl_tree);
        count--;
      }
      //Assert(count >= 3 && count <= 6, " 3_6?");
      send_code(s, REP_3_6, s.bl_tree);
      send_bits(s, count - 3, 2);

    } else if (count <= 10) {
      send_code(s, REPZ_3_10, s.bl_tree);
      send_bits(s, count - 3, 3);

    } else {
      send_code(s, REPZ_11_138, s.bl_tree);
      send_bits(s, count - 11, 7);
    }

    count = 0;
    prevlen = curlen;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;

    } else if (curlen === nextlen) {
      max_count = 6;
      min_count = 3;

    } else {
      max_count = 7;
      min_count = 4;
    }
  }
};


/* ===========================================================================
 * Construct the Huffman tree for the bit lengths and return the index in
 * bl_order of the last bit length code to send.
 */
const build_bl_tree = (s) => {

  let max_blindex;  /* index of last bit length code of non zero freq */

  /* Determine the bit length frequencies for literal and distance trees */
  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);

  /* Build the bit length tree: */
  build_tree(s, s.bl_desc);
  /* opt_len now includes the length of the tree representations, except
   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
   */

  /* Determine the number of bit length codes to send. The pkzip format
   * requires that at least 4 bit length codes be sent. (appnote.txt says
   * 3 but the actual value used is 4.)
   */
  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
      break;
    }
  }
  /* Update opt_len to include the bit length tree and counts */
  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
  //        s->opt_len, s->static_len));

  return max_blindex;
};


/* ===========================================================================
 * Send the header for a block using dynamic Huffman trees: the counts, the
 * lengths of the bit length codes, the literal tree and the distance tree.
 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
 */
const send_all_trees = (s, lcodes, dcodes, blcodes) => {
//    deflate_state *s;
//    int lcodes, dcodes, blcodes; /* number of codes for each tree */

  let rank;                    /* index in bl_order */

  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
  //        "too many codes");
  //Tracev((stderr, "\nbl counts: "));
  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
  send_bits(s, dcodes - 1,   5);
  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
  for (rank = 0; rank < blcodes; rank++) {
    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
  }
  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));

  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
};


/* ===========================================================================
 * Check if the data type is TEXT or BINARY, using the following algorithm:
 * - TEXT if the two conditions below are satisfied:
 *    a) There are no non-portable control characters belonging to the
 *       "block list" (0..6, 14..25, 28..31).
 *    b) There is at least one printable character belonging to the
 *       "allow list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
 * - BINARY otherwise.
 * - The following partially-portable control characters form a
 *   "gray list" that is ignored in this detection algorithm:
 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
 * IN assertion: the fields Freq of dyn_ltree are set.
 */
const detect_data_type = (s) => {
  /* block_mask is the bit mask of block-listed bytes
   * set bits 0..6, 14..25, and 28..31
   * 0xf3ffc07f = binary 11110011111111111100000001111111
   */
  let block_mask = 0xf3ffc07f;
  let n;

  /* Check for non-textual ("block-listed") bytes. */
  for (n = 0; n <= 31; n++, block_mask >>>= 1) {
    if ((block_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
      return Z_BINARY;
    }
  }

  /* Check for textual ("allow-listed") bytes. */
  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
    return Z_TEXT;
  }
  for (n = 32; n < LITERALS; n++) {
    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
      return Z_TEXT;
    }
  }

  /* There are no "block-listed" or "allow-listed" bytes:
   * this stream either is empty or has tolerated ("gray-listed") bytes only.
   */
  return Z_BINARY;
};


let static_init_done = false;

/* ===========================================================================
 * Initialize the tree data structures for a new zlib stream.
 */
const _tr_init = (s) =>
{

  if (!static_init_done) {
    tr_static_init();
    static_init_done = true;
  }

  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);

  s.bi_buf = 0;
  s.bi_valid = 0;

  /* Initialize the first block of the first file: */
  init_block(s);
};


/* ===========================================================================
 * Send a stored block
 */
const _tr_stored_block = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
  bi_windup(s);        /* align on byte boundary */
  put_short(s, stored_len);
  put_short(s, ~stored_len);
  if (stored_len) {
    s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
  }
  s.pending += stored_len;
};


/* ===========================================================================
 * Send one empty static block to give enough lookahead for inflate.
 * This takes 10 bits, of which 7 may remain in the bit buffer.
 */
const _tr_align = (s) => {
  send_bits(s, STATIC_TREES << 1, 3);
  send_code(s, END_BLOCK, static_ltree);
  bi_flush(s);
};


/* ===========================================================================
 * Determine the best encoding for the current block: dynamic trees, static
 * trees or store, and write out the encoded block.
 */
const _tr_flush_block = (s, buf, stored_len, last) => {
//DeflateState *s;
//charf *buf;       /* input block, or NULL if too old */
//ulg stored_len;   /* length of input block */
//int last;         /* one if this is the last block for a file */

  let opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
  let max_blindex = 0;        /* index of last bit length code of non zero freq */

  /* Build the Huffman trees unless a stored block is forced */
  if (s.level > 0) {

    /* Check if the file is binary or text */
    if (s.strm.data_type === Z_UNKNOWN) {
      s.strm.data_type = detect_data_type(s);
    }

    /* Construct the literal and distance trees */
    build_tree(s, s.l_desc);
    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));

    build_tree(s, s.d_desc);
    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
    //        s->static_len));
    /* At this point, opt_len and static_len are the total bit lengths of
     * the compressed block data, excluding the tree representations.
     */

    /* Build the bit length tree for the above two trees, and get the index
     * in bl_order of the last bit length code to send.
     */
    max_blindex = build_bl_tree(s);

    /* Determine the best encoding. Compute the block lengths in bytes. */
    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
    static_lenb = (s.static_len + 3 + 7) >>> 3;

    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
    //        s->sym_next / 3));

    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }

  } else {
    // Assert(buf != (char*)0, "lost buf");
    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
  }

  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
    /* 4: two words for the lengths */

    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
     * Otherwise we can't have processed more than WSIZE input bytes since
     * the last block flush, because compression would have been
     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
     * transform a block into a stored block.
     */
    _tr_stored_block(s, buf, stored_len, last);

  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {

    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
    compress_block(s, static_ltree, static_dtree);

  } else {
    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
    compress_block(s, s.dyn_ltree, s.dyn_dtree);
  }
  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
  /* The above check is made mod 2^32, for files larger than 512 MB
   * and uLong implemented on 32 bits.
   */
  init_block(s);

  if (last) {
    bi_windup(s);
  }
  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
  //       s->compressed_len-7*last));
};

/* ===========================================================================
 * Save the match info and tally the frequency counts. Return true if
 * the current block must be flushed.
 */
const _tr_tally = (s, dist, lc) => {
//    deflate_state *s;
//    unsigned dist;  /* distance of matched string */
//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */

  s.pending_buf[s.sym_buf + s.sym_next++] = dist;
  s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
  s.pending_buf[s.sym_buf + s.sym_next++] = lc;
  if (dist === 0) {
    /* lc is the unmatched char */
    s.dyn_ltree[lc * 2]/*.Freq*/++;
  } else {
    s.matches++;
    /* Here, lc is the match length - MIN_MATCH */
    dist--;             /* dist = match distance - 1 */
    //Assert((ush)dist < (ush)MAX_DIST(s) &&
    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");

    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
  }

  return (s.sym_next === s.sym_end);
};

module.exports._tr_init  = _tr_init;
module.exports._tr_stored_block = _tr_stored_block;
module.exports._tr_flush_block  = _tr_flush_block;
module.exports._tr_tally = _tr_tally;
module.exports._tr_align = _tr_align;


/***/ }),

/***/ 667:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = function (gbk_us){
    var gbk = __webpack_require__(621)(gbk_us);
    gbk.URI = __webpack_require__(741)(gbk);
    return gbk;
};

/***/ }),

/***/ 668:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// Top level file is just a mixin of submodules & constants


const { Deflate, deflate, deflateRaw, gzip } = __webpack_require__(303);

const { Inflate, inflate, inflateRaw, ungzip } = __webpack_require__(83);

const constants = __webpack_require__(681);

module.exports.Deflate = Deflate;
module.exports.deflate = deflate;
module.exports.deflateRaw = deflateRaw;
module.exports.gzip = gzip;
module.exports.Inflate = Inflate;
module.exports.inflate = inflate;
module.exports.inflateRaw = inflateRaw;
module.exports.ungzip = ungzip;
module.exports.constants = constants;


/***/ }),

/***/ 674:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {
  2:      'need dictionary',     /* Z_NEED_DICT       2  */
  1:      'stream end',          /* Z_STREAM_END      1  */
  0:      '',                    /* Z_OK              0  */
  '-1':   'file error',          /* Z_ERRNO         (-1) */
  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
};


/***/ }),

/***/ 681:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

module.exports = {

  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH:         0,
  Z_PARTIAL_FLUSH:    1,
  Z_SYNC_FLUSH:       2,
  Z_FULL_FLUSH:       3,
  Z_FINISH:           4,
  Z_BLOCK:            5,
  Z_TREES:            6,

  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK:               0,
  Z_STREAM_END:       1,
  Z_NEED_DICT:        2,
  Z_ERRNO:           -1,
  Z_STREAM_ERROR:    -2,
  Z_DATA_ERROR:      -3,
  Z_MEM_ERROR:       -4,
  Z_BUF_ERROR:       -5,
  //Z_VERSION_ERROR: -6,

  /* compression levels */
  Z_NO_COMPRESSION:         0,
  Z_BEST_SPEED:             1,
  Z_BEST_COMPRESSION:       9,
  Z_DEFAULT_COMPRESSION:   -1,


  Z_FILTERED:               1,
  Z_HUFFMAN_ONLY:           2,
  Z_RLE:                    3,
  Z_FIXED:                  4,
  Z_DEFAULT_STRATEGY:       0,

  /* Possible values of the data_type field (though see inflate()) */
  Z_BINARY:                 0,
  Z_TEXT:                   1,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN:                2,

  /* The deflate compression method */
  Z_DEFLATED:               8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};


/***/ }),

/***/ 741:
/***/ ((module) => {

module.exports = function(GBK){
	var passChars = '!\'()*-._~';	
	var otherPassChars = '#$&+,/:;=?@';
	function getModue(passChars){
		var passBits = passChars.split('').sort();
		var isPass = function (s){
			return ~passChars.indexOf(s) || /[0-9a-zA-Z]/.test(s)
		}
		return {
			encode:function(str){
				return (str+'').replace(/./g,function(v){
					if(isPass(v)) return v;
					var bitArr = GBK.encode(v);
					for(var i=0; i<bitArr.length; i++){
						bitArr[i] = '%' + ('0'+bitArr[i].toString(16)).substr(-2).toUpperCase();
					}
					return bitArr.join('');
				})
			},
			decode:function(enstr){
				enstr = String(enstr);
				var outStr = '';
				for(var i=0; i<enstr.length; i++){
					var char = enstr.charAt(i);
					if(char === '%' && i + 2 < enstr.length){ 
						var code1 = parseInt(enstr.substr(i+1,2),16)
						if(!isNaN(code1)){
							var _i = i + 2;
							if(code1 > 0x80){
								var code2;
								if(enstr.charAt(_i+1) === '%'){
									code2 = parseInt(enstr.substr(_i+2,2),16)
									_i += 3;
								}else{
									code2 = enstr.charCodeAt(_i+1);
									_i += 1;
								}
								if(code2 >= 0x40){
									i = _i;
									outStr += GBK.decode([code1,code2]);
									continue;
								}
							}else{
								i += 2;
								outStr += String.fromCharCode(code1);
								continue;
							}
						}
					}
					outStr += char;
				}
				return outStr;

			}
		}
	}

	var URIComponent = getModue(passChars);
	var URI = getModue(passChars + otherPassChars);

	return {
		encodeURI:URI.encode,
		decodeURI:URI.decode,
		encodeURIComponent:URIComponent.encode,
		decodeURIComponent:URIComponent.decode
	}
};

/***/ }),

/***/ 778:
/***/ ((module) => {


module.exports = function (player) {
  /**
   * Adds a listener of an event
   * @chainable
   * @param {String} event - the event name
   * @param {Function} callback - the event handler
   * @return {SamplePlayer} the player
   * @example
   * player.on('start', function(time, note) {
   *   console.log(time, note)
   * })
   */
  player.on = function (event, cb) {
    if (arguments.length === 1 && typeof event === 'function') return player.on('event', event)
    var prop = 'on' + event
    var old = player[prop]
    player[prop] = old ? chain(old, cb) : cb
    return player
  }
  return player
}

function chain (fn1, fn2) {
  return function (a, b, c, d) { fn1(a, b, c, d); fn2(a, b, c, d) }
}


/***/ }),

/***/ 795:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var base64 = __webpack_require__(332)
var fetch = __webpack_require__(655)

// Given a regex, return a function that test if against a string
function fromRegex (r) {
  return function (o) { return typeof o === 'string' && r.test(o) }
}
// Try to apply a prefix to a name
function prefix (pre, name) {
  return typeof pre === 'string' ? pre + name
    : typeof pre === 'function' ? pre(name)
    : name
}

/**
 * Load one or more audio files
 *
 *
 * Possible option keys:
 *
 * - __from__ {Function|String}: a function or string to convert from file names to urls.
 * If is a string it will be prefixed to the name:
 * `load(ac, 'snare.mp3', { from: 'http://audio.net/samples/' })`
 * If it's a function it receives the file name and should return the url as string.
 * - __only__ {Array} - when loading objects, if provided, only the given keys
 * will be included in the decoded object:
 * `load(ac, 'piano.json', { only: ['C2', 'D2'] })`
 *
 * @param {AudioContext} ac - the audio context
 * @param {Object} source - the object to be loaded
 * @param {Object} options - (Optional) the load options for that object
 * @param {Object} defaultValue - (Optional) the default value to return as
 * in a promise if not valid loader found
 */
function load (ac, source, options, defVal) {
  var loader =
    // Basic audio loading
      isArrayBuffer(source) ? loadArrayBuffer
    : isAudioFileName(source) ? loadAudioFile
    : isPromise(source) ? loadPromise
    // Compound objects
    : isArray(source) ? loadArrayData
    : isObject(source) ? loadObjectData
    : isJsonFileName(source) ? loadJsonFile
    // Base64 encoded audio
    : isBase64Audio(source) ? loadBase64Audio
    : isJsFileName(source) ? loadMidiJSFile
    : null

  var opts = options || {}
  return loader ? loader(ac, source, opts)
    : defVal ? Promise.resolve(defVal)
    : Promise.reject('Source not valid (' + source + ')')
}
load.fetch = fetch

// BASIC AUDIO LOADING
// ===================

// Load (decode) an array buffer
function isArrayBuffer (o) { return o instanceof ArrayBuffer }
function loadArrayBuffer (ac, array, options) {
  return new Promise(function (done, reject) {
    ac.decodeAudioData(array,
      function (buffer) { done(buffer) },
      function () { reject("Can't decode audio data (" + array.slice(0, 30) + '...)') }
    )
  })
}

// Load an audio filename
var isAudioFileName = fromRegex(/\.(mp3|wav|ogg)(\?.*)?$/i)
function loadAudioFile (ac, name, options) {
  var url = prefix(options.from, name)
  return load(ac, load.fetch(url, 'arraybuffer'), options)
}

// Load the result of a promise
function isPromise (o) { return o && typeof o.then === 'function' }
function loadPromise (ac, promise, options) {
  return promise.then(function (value) {
    return load(ac, value, options)
  })
}

// COMPOUND OBJECTS
// ================

// Try to load all the items of an array
var isArray = Array.isArray
function loadArrayData (ac, array, options) {
  return Promise.all(array.map(function (data) {
    return load(ac, data, options, data)
  }))
}

// Try to load all the values of a key/value object
function isObject (o) { return o && typeof o === 'object' }
function loadObjectData (ac, obj, options) {
  var dest = {}
  var promises = Object.keys(obj).map(function (key) {
    if (options.only && options.only.indexOf(key) === -1) return null
    var value = obj[key]
    return load(ac, value, options, value).then(function (audio) {
      dest[key] = audio
    })
  })
  return Promise.all(promises).then(function () { return dest })
}

// Load the content of a JSON file
var isJsonFileName = fromRegex(/\.json(\?.*)?$/i)
function loadJsonFile (ac, name, options) {
  var url = prefix(options.from, name)
  return load(ac, load.fetch(url, 'text').then(JSON.parse), options)
}

// BASE64 ENCODED FORMATS
// ======================

// Load strings with Base64 encoded audio
var isBase64Audio = fromRegex(/^data:audio/)
function loadBase64Audio (ac, source, options) {
  var i = source.indexOf(',')
  return load(ac, base64.decode(source.slice(i + 1)).buffer, options)
}

// Load .js files with MidiJS soundfont prerendered audio
var isJsFileName = fromRegex(/\.js(\?.*)?$/i)
function loadMidiJSFile (ac, name, options) {
  var url = prefix(options.from, name)
  return load(ac, load.fetch(url, 'text').then(midiJsToJson), options)
}

// convert a MIDI.js javascript soundfont file to json
function midiJsToJson (data) {
  var begin = data.indexOf('MIDI.Soundfont.')
  if (begin < 0) throw Error('Invalid MIDI.js Soundfont format')
  begin = data.indexOf('=', begin) + 2
  var end = data.lastIndexOf(',')
  return JSON.parse(data.slice(begin, end) + '}')
}

if ( true && module.exports) module.exports = load
if (typeof window !== 'undefined') window.loadAudio = load


/***/ }),

/***/ 805:
/***/ ((module) => {

"use strict";



const _has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

module.exports.assign = function (obj /*from1, from2, from3, ...*/) {
  const sources = Array.prototype.slice.call(arguments, 1);
  while (sources.length) {
    const source = sources.shift();
    if (!source) { continue; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be non-object');
    }

    for (const p in source) {
      if (_has(source, p)) {
        obj[p] = source[p];
      }
    }
  }

  return obj;
};


// Join array of chunks to single array.
module.exports.flattenChunks = (chunks) => {
  // calculate data length
  let len = 0;

  for (let i = 0, l = chunks.length; i < l; i++) {
    len += chunks[i].length;
  }

  // join chunks
  const result = new Uint8Array(len);

  for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
    let chunk = chunks[i];
    result.set(chunk, pos);
    pos += chunk.length;
  }

  return result;
};


/***/ }),

/***/ 823:
/***/ ((module) => {

"use strict";


// Note: we can't get significant speed boost here.
// So write code to minimize size - no pregenerated tables
// and array tools dependencies.

// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

// Use ordinary array, since untyped makes no boost here
const makeTable = () => {
  let c, table = [];

  for (var n = 0; n < 256; n++) {
    c = n;
    for (var k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }

  return table;
};

// Create table on load. Just 255 signed longs. Not a problem.
const crcTable = new Uint32Array(makeTable());


const crc32 = (crc, buf, len, pos) => {
  const t = crcTable;
  const end = pos + len;

  crc ^= -1;

  for (let i = pos; i < end; i++) {
    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
  }

  return (crc ^ (-1)); // >>> 0;
};


module.exports = crc32;


/***/ }),

/***/ 895:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
// mrp-editor.ts
var pako = __importStar(__webpack_require__(668));
var GBK = __importStar(__webpack_require__(298));
var base64_1 = __webpack_require__(161);
var mrpinfo_1 = __webpack_require__(289);
var player_1 = __webpack_require__(463);
function padStart(str, targetLength, padString) {
    if (padString === void 0) { padString = ' '; }
    targetLength = Math.floor(targetLength); // 确保是整数
    if (str.length >= targetLength) {
        return str;
    }
    padString = padString || ' ';
    var padLength = targetLength - str.length;
    var padding = '';
    while (padding.length < padLength) {
        padding += padString;
    }
    return padding.slice(0, padLength) + str;
}
// 辅助工具类
var ListUtil = /** @class */ (function () {
    function ListUtil() {
    }
    ListUtil.insertIntoUint8Array = function (target, offset, data) {
        var newArray = new Uint8Array(target.length + data.length);
        newArray.set(target.subarray(0, offset), 0);
        newArray.set(data, offset);
        newArray.set(target.subarray(offset), offset + data.length);
        return newArray;
    };
    ListUtil.removeRange = function (target, start, length) {
        var newArray = new Uint8Array(target.length - length);
        newArray.set(target.subarray(0, start), 0);
        newArray.set(target.subarray(start + length), start);
        return newArray;
    };
    ListUtil.deleteFromUint8Array = function (target, start, length) {
        return this.removeRange(target, start, length);
    };
    return ListUtil;
}());
// MRP 文件项类
var FileItem = /** @class */ (function () {
    function FileItem(filename, filenameLen, fileOffset, fileLen) {
        this.filename = filename;
        this.filenameLen = filenameLen;
        this.fileOffset = fileOffset;
        this.fileLen = fileLen;
    }
    FileItem.prototype.toString = function () {
        return "\u6587\u4EF6: ".concat(this.filename, " (\u504F\u79FB: ").concat(this.fileOffset, ", \u957F\u5EA6: ").concat(this.fileLen, ")");
    };
    return FileItem;
}());
// UI 控制器类
var MrpEditorUI = /** @class */ (function () {
    function MrpEditorUI() {
        this.mrpInfo = null;
        this.currentFile = null;
        this.player = null;
        this.customViewers = new Map();
        this.initEventListeners();
        this.setupFileInputListener();
        this.setupClipboardListener();
        // 暴露全局 API 供插件开发使用
        window.mrpEditorApp = this;
        window.MrpInfo = mrpinfo_1.MrpInfo;
        window.FileItem = FileItem;
        window.pako = pako;
        window.GBK = GBK;
    }
    MrpEditorUI.prototype.registerViewer = function (extension, action) {
        this.customViewers.set(extension.toLowerCase(), action);
    };
    MrpEditorUI.prototype.showToast = function (message, duration) {
        if (duration === void 0) { duration = 3000; }
        console.log("toast:" + message);
        var toastContainer = document.getElementById('toastContainer');
        if (!toastContainer)
            return;
        var toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toastContainer.appendChild(toast);
        // 触发重绘
        void toast.offsetWidth;
        // 显示 toast
        toast.classList.add('show');
        // 自动消失
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () {
                toast.remove();
            }, 300);
        }, duration);
    };
    MrpEditorUI.prototype.setupFileInputListener = function () {
        var fileInput = document.getElementById('newFileContent');
        var fileNameInput = document.getElementById('newFileName');
        fileInput.addEventListener('change', function () {
            if (fileInput.files && fileInput.files.length > 0) {
                var file = fileInput.files[0];
                // 只有当文件名输入框为空时才自动填充
                if (!fileNameInput.value.trim()) {
                    fileNameInput.value = file.name;
                }
            }
        });
    };
    MrpEditorUI.prototype.initEventListeners = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        // 移动端菜单按钮
        (_a = document.getElementById('mobileMenuBtn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            var menuItems = document.getElementById('menuItems');
            if (menuItems)
                menuItems.classList.toggle('show');
        });
        // 为所有菜单项添加点击后关闭菜单的逻辑
        var menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(function (item) {
            item.addEventListener('click', function () {
                var menu = document.getElementById('menuItems');
                if (menu && window.innerWidth <= 768) { // 只在移动端关闭
                    menu.classList.remove('show');
                }
            });
        });
        // 切换基本信息面板折叠状态
        var fileInfoHeader = document.getElementById('fileInfoHeader');
        var toggleInfoBtn = document.getElementById('toggleInfoBtn');
        var fileInfoPanel = document.getElementById('fileInfoPanel');
        if (fileInfoHeader && toggleInfoBtn && fileInfoPanel) {
            var togglePanel_1 = function () {
                fileInfoPanel.classList.toggle('collapsed');
                if (fileInfoPanel.classList.contains('collapsed')) {
                    toggleInfoBtn.innerHTML = '<i class="fas fa-chevron-down"></i> 展开';
                }
                else {
                    toggleInfoBtn.innerHTML = '<i class="fas fa-chevron-up"></i> 收起';
                }
            };
            fileInfoHeader.addEventListener('click', togglePanel_1);
            toggleInfoBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                togglePanel_1();
            });
        }
        // 编辑文件信息按钮
        (_b = document.getElementById('editInfoBtn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!_this.mrpInfo) {
                _this.showToast('请先打开一个MRP文件！');
                return;
            }
            _this.showEditModal();
        });
        // 关闭编辑模态框
        (_c = document.getElementById('closeEditModal')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () { return _this.hideEditModal(); });
        (_d = document.getElementById('cancelEditBtn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () { return _this.hideEditModal(); });
        // 保存编辑信息
        (_e = document.getElementById('editInfoForm')) === null || _e === void 0 ? void 0 : _e.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.saveFileInfo();
        });
        // 添加文件按钮
        (_f = document.getElementById('addFileBtn')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function () {
            if (!_this.mrpInfo) {
                _this.showToast('请先打开一个MRP文件！');
                return;
            }
            _this.showAddFileModal();
        });
        // 关闭添加文件模态框
        (_g = document.getElementById('closeAddModal')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', function () { return _this.hideAddFileModal(); });
        (_h = document.getElementById('cancelAddBtn')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', function () { return _this.hideAddFileModal(); });
        // 添加文件表单提交
        (_j = document.getElementById('addFileForm')) === null || _j === void 0 ? void 0 : _j.addEventListener('submit', function (e) {
            e.preventDefault();
            _this.addFile();
        });
        // 删除文件按钮事件委托
        (_k = document.getElementById('fileListBody')) === null || _k === void 0 ? void 0 : _k.addEventListener('click', function (e) {
            var _a, _b;
            var target = e.target;
            var row = target.closest('tr');
            if (!row || !_this.mrpInfo)
                return;
            // 获取文件名
            var filename = (_b = (_a = row.querySelector('td:nth-child(2)')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            if (!filename)
                return;
            // 处理删除按钮
            if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
                e.stopPropagation();
                _this.deleteFile(target);
                return;
            }
            // 处理导出按钮
            if (target.classList.contains('export-btn') || target.closest('.export-btn')) {
                e.stopPropagation();
                try {
                    var fileData = _this.mrpInfo.getFileData(filename);
                    if (fileData) {
                        _this.exportFile(filename, fileData);
                    }
                    else {
                        _this.showToast('获取文件数据失败');
                    }
                }
                catch (error) {
                    _this.showToast("\u5BFC\u51FA\u6587\u4EF6\u5931\u8D25: ".concat(error));
                }
                return;
            }
            // 处理查看按钮
            if (target.classList.contains('view-btn') || target.closest('.view-btn')) {
                e.stopPropagation();
                _this.viewFile(filename);
                return;
            }
        });
        // 关于按钮
        (_l = document.getElementById('aboutBtn')) === null || _l === void 0 ? void 0 : _l.addEventListener('click', function () {
            _this.showAboutModal();
        });
        // 关闭关于模态框
        (_m = document.getElementById('closeAboutModal')) === null || _m === void 0 ? void 0 : _m.addEventListener('click', function () { return _this.hideAboutModal(); });
        (_o = document.getElementById('closeAboutBtn')) === null || _o === void 0 ? void 0 : _o.addEventListener('click', function () { return _this.hideAboutModal(); });
        // 打开文件按钮
        (_p = document.getElementById('openFileBtn')) === null || _p === void 0 ? void 0 : _p.addEventListener('click', function () {
            _this.openFile();
        });
        // 保存文件按钮
        (_q = document.getElementById('saveFileBtn')) === null || _q === void 0 ? void 0 : _q.addEventListener('click', function () {
            if (!_this.mrpInfo) {
                _this.showToast('请先打开一个MRP文件！');
                return;
            }
            _this.saveFile();
        });
        // 插入文件项按钮
        (_r = document.getElementById('insertFileBtn')) === null || _r === void 0 ? void 0 : _r.addEventListener('click', function () {
            _this.showAddFileModal();
        });
        // 帮助按钮
        (_s = document.getElementById('helpBtn')) === null || _s === void 0 ? void 0 : _s.addEventListener('click', function () {
            alert('帮助文档将在实际应用中提供');
        });
        var that = this;
        window.addEventListener('pageshow', function (event) {
            console.log("用户点击返回。。。。");
            // 检查是否是从缓存中恢复的页面（即返回操作）
            console.log('用户通过返回按钮回到此页');
            var mrpFileName = localStorage.getItem("mrpfilename");
            var mrpFile = localStorage.getItem("mrpfile");
            if (mrpFileName && mrpFile) {
                var mrpFileData = (0, base64_1.decodeBase64)(mrpFile);
                that.currentFile = new File([mrpFileData], mrpFileName, { type: 'application/octet-stream' });
                try {
                    this.localStorage.removeItem('mrpfile');
                    this.localStorage.removeItem('mrpfilename');
                    that.mrpInfo = mrpinfo_1.MrpInfo.fromBytes(mrpFileData);
                    // 更新 UI
                    that.updateFileInfoUI();
                    that.updateFileListUI();
                    that.updateBasicInfoUI();
                    that.showToast('文件加载成功！');
                }
                catch (error) {
                    alert("\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ".concat(error));
                }
            }
            var rcfileData = localStorage.getItem('rcfile');
            var rcfilename = localStorage.getItem('rcfilename');
            if (rcfilename && rcfileData) {
                try {
                    this.localStorage.removeItem('rcfile');
                    this.localStorage.removeItem('rcfilename');
                    var fileData = (0, base64_1.decodeBase64)(rcfileData);
                    if (that.mrpInfo) {
                        that.mrpInfo.insert(rcfilename, fileData);
                        // 更新 UI
                        that.updateFileInfoUI();
                        that.updateFileListUI();
                        that.updateBasicInfoUI();
                        //that.showToast('文件加载成功！');
                        that.showToast("" + rcfilename + "已更新");
                    }
                }
                catch (error) {
                    alert("\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ".concat(error));
                }
            }
        });
    };
    MrpEditorUI.prototype.showEditModal = function () {
        if (!this.mrpInfo)
            return;
        var modal = document.getElementById('editInfoModal');
        if (modal)
            modal.style.display = 'flex';
        // 填充表单数据
        document.getElementById('editDisplayName').value = this.mrpInfo.displayName;
        document.getElementById('editFileName').value = this.mrpInfo.fileName;
        document.getElementById('editAuthStr').value = this.mrpInfo.authStr;
        document.getElementById('editAppid').value = this.mrpInfo.appid.toString();
        document.getElementById('editVersion').value = this.mrpInfo.version.toString();
        document.getElementById('editBuilderVersion').value = this.mrpInfo.builderVersion.toString();
        document.getElementById('editVendor').value = this.mrpInfo.vendor;
        document.getElementById('editDesc').value = this.mrpInfo.desc;
        document.getElementById('editScreenWidth').value = this.mrpInfo.screenWidth.toString();
        document.getElementById('editScreenHeight').value = this.mrpInfo.screenHeight.toString();
        document.getElementById('editPlat').value = this.mrpInfo.plat.toString();
    };
    MrpEditorUI.prototype.hideEditModal = function () {
        var modal = document.getElementById('editInfoModal');
        if (modal)
            modal.style.display = 'none';
    };
    MrpEditorUI.prototype.saveFileInfo = function () {
        if (!this.mrpInfo)
            return;
        // 更新 MRP 信息
        this.mrpInfo.displayName = document.getElementById('editDisplayName').value;
        this.mrpInfo.fileName = document.getElementById('editFileName').value;
        this.mrpInfo.authStr = document.getElementById('editAuthStr').value;
        this.mrpInfo.appid = parseInt(document.getElementById('editAppid').value);
        this.mrpInfo.version = parseInt(document.getElementById('editVersion').value);
        this.mrpInfo.builderVersion = parseInt(document.getElementById('editBuilderVersion').value);
        this.mrpInfo.vendor = document.getElementById('editVendor').value;
        this.mrpInfo.desc = document.getElementById('editDesc').value;
        this.mrpInfo.screenWidth = parseInt(document.getElementById('editScreenWidth').value);
        this.mrpInfo.screenHeight = parseInt(document.getElementById('editScreenHeight').value);
        this.mrpInfo.plat = parseInt(document.getElementById('editPlat').value);
        console.log("文件信息", this.mrpInfo);
        // 更新头部信息
        this.mrpInfo.writeHeader();
        // 更新 UI 显示
        this.updateFileInfoUI();
        this.hideEditModal();
        this.showToast('文件信息已更新！');
    };
    MrpEditorUI.prototype.showAddFileModal = function () {
        var modal = document.getElementById('addFileModal');
        if (modal)
            modal.style.display = 'flex';
    };
    MrpEditorUI.prototype.hideAddFileModal = function () {
        var modal = document.getElementById('addFileModal');
        if (modal)
            modal.style.display = 'none';
    };
    MrpEditorUI.prototype.addFile = function () {
        var _this = this;
        if (!this.mrpInfo) {
            this.showToast('请先打开一个MRP文件！');
            this.hideAddFileModal();
            return;
        }
        var fileNameInput = document.getElementById('newFileName');
        var fileInput = document.getElementById('newFileContent');
        // 自动填充文件名逻辑
        if (fileInput.files && fileInput.files.length > 0 && !fileNameInput.value.trim()) {
            var file_1 = fileInput.files[0];
            fileNameInput.value = file_1.name;
        }
        var fileName = fileNameInput.value.trim();
        if (!fileName) {
            alert('请输入文件名！');
            return;
        }
        if (!fileInput.files || fileInput.files.length === 0) {
            alert('请选择要添加的文件！');
            return;
        }
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var _a, _b;
            try {
                var fileData = new Uint8Array((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                (_b = _this.mrpInfo) === null || _b === void 0 ? void 0 : _b.insert(fileName, fileData);
                // 更新 UI
                _this.updateFileListUI();
                _this.updateBasicInfoUI();
                _this.hideAddFileModal();
                fileNameInput.value = '';
                fileInput.value = '';
                _this.showToast('文件已添加到MRP中！');
            }
            catch (error) {
                alert("\u6DFB\u52A0\u6587\u4EF6\u5931\u8D25: ".concat(error));
            }
        };
        reader.readAsArrayBuffer(file);
    };
    MrpEditorUI.prototype.viewFile = function (filename) {
        var _a;
        if (!this.mrpInfo)
            return;
        try {
            var fileData = this.mrpInfo.getFileData(filename);
            if (!fileData) {
                this.showToast('无法获取文件内容');
                return;
            }
            if (this.mrpInfo._isGzip(fileData)) {
                fileData = pako.ungzip(fileData);
            }
            var ext = (_a = filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            // 1. 优先检查自定义查看器 (插件注册)
            if (ext && this.customViewers.has(ext)) {
                var action = this.customViewers.get(ext);
                if (typeof action === 'function') {
                    action(filename, fileData);
                }
                else if (typeof action === 'string') {
                    // 如果是URL，将数据存入 localStorage 并跳转
                    var base64Data = (0, base64_1.encodeBase64)(fileData);
                    localStorage.setItem('ext_filename', filename);
                    localStorage.setItem('ext_filedata', base64Data);
                    if (this.currentFile) {
                        localStorage.setItem("mrpfile", (0, base64_1.encodeBase64)(this.mrpInfo.data));
                        localStorage.setItem("mrpfilename", this.currentFile.name);
                    }
                    window.location.href = action;
                }
                return;
            }
            // 检查是否是文本文件
            var textExtensions = ['txt', 'ini', 'conf', 'js', 'json', 'xml', 'html', 'css'];
            var musicExtensions = ['mp3', 'wav', 'ogg', 'flac', 'mid'];
            if (ext && textExtensions.includes(ext)) {
                // 尝试解码为文本
                try {
                    var content = void 0;
                    if (this.mrpInfo._isGzip(fileData)) {
                        var decompressed = pako.ungzip(fileData);
                        content = GBK.decode(decompressed);
                    }
                    else {
                        content = GBK.decode(fileData);
                    }
                    // 显示文件内容（可以扩展为模态框显示）
                    console.log("\u6587\u4EF6 ".concat(filename, " \u5185\u5BB9:"), content);
                    alert("\u6587\u4EF6 ".concat(filename, " \u5185\u5BB9:\n\n").concat(content));
                    this.showToast("\u5DF2\u67E5\u770B\u6587\u4EF6 ".concat(filename, " \u5185\u5BB9\uFF08\u67E5\u770B\u63A7\u5236\u53F0\uFF09"));
                }
                catch (e) {
                    this.showToast('无法解码文件内容');
                }
            }
            else if (ext && musicExtensions.includes(ext)) {
                // 尝试播放音频文件
                // const audio = new Audio(URL.createObjectURL(new Blob([fileData])));
                // audio.controls = true;
                // audio.play();
                // document.body.appendChild(audio);
                if (!this.player) {
                    this.player = new player_1.Player();
                }
                this.player.setData(fileData, filename);
                this.player.play();
                this.showToast("\u5DF2\u64AD\u653E\u97F3\u9891\u6587\u4EF6 ".concat(filename));
            }
            else if (ext == 'rc') {
                var base64Data = (0, base64_1.encodeBase64)(fileData);
                localStorage.setItem('rcfile', base64Data);
                localStorage.setItem('rcfilename', filename);
                localStorage.setItem("mrpfile", (0, base64_1.encodeBase64)(this.mrpInfo.data));
                localStorage.setItem("mrpfilename", this.currentFile.name);
                window.location.href = "./RcEditor/?from=mrpeditor";
            }
            else if (ext == 'bmp' || ext == 'bma') {
                var base64Data = (0, base64_1.encodeBase64)(fileData);
                localStorage.setItem('bmpfilename', filename);
                localStorage.setItem('bmpfiledata', base64Data);
                localStorage.setItem("mrpfile", (0, base64_1.encodeBase64)(this.mrpInfo.data));
                localStorage.setItem("mrpfilename", this.currentFile.name);
                window.location.href = "./BmaViewer/?from=mrpeditor";
            }
            else if (ext === 'bin') {
                // 二进制文件，直接显示十六进制内容
                var hexContent = Array.from(fileData).map(function (byte) { return byte.toString(16).padStart(2, '0'); }).join(' ');
                console.log("\u6587\u4EF6 ".concat(filename, " \u5341\u516D\u8FDB\u5236\u5185\u5BB9:"), hexContent);
                alert("\u6587\u4EF6 ".concat(filename, " \u5341\u516D\u8FDB\u5236\u5185\u5BB9:\n\n").concat(hexContent));
                this.showToast("\u5DF2\u67E5\u770B\u6587\u4EF6 ".concat(filename, " \u5341\u516D\u8FDB\u5236\u5185\u5BB9\uFF08\u67E5\u770B\u63A7\u5236\u53F0\uFF09"));
            }
            else {
                this.showToast('此文件类型不支持预览');
            }
        }
        catch (error) {
            this.showToast("\u67E5\u770B\u6587\u4EF6\u5931\u8D2511: ".concat(error));
            // 打印堆栈信息
            if (error instanceof Error) {
                console.error(error.message);
                console.error('错误堆栈:', error.stack); // 包含文件名和行号
            }
        }
    };
    MrpEditorUI.prototype.exportFile = function (filename, fileData) {
        var _a, _b;
        try {
            var dataToExport = fileData;
            var exportFilename = filename;
            // 检查是否是 GZIP 文件
            if ((_a = this.mrpInfo) === null || _a === void 0 ? void 0 : _a._isGzip(fileData)) {
                try {
                    dataToExport = pako.ungzip(fileData);
                    // 如果原始文件名有 .gz 后缀，去掉它
                    if (filename.toLowerCase().endsWith('.gz')) {
                        exportFilename = filename.slice(0, -3);
                    }
                    this.showToast('已自动解压 GZIP 文件');
                }
                catch (e) {
                    this.showToast('GZIP 解压失败，导出原始文件');
                }
            }
            // 获取文件扩展名
            var ext = ((_b = exportFilename.split('.').pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || 'bin';
            // 创建 blob 对象
            var blob = new Blob([dataToExport], { type: 'application/octet-stream' });
            var url_1 = URL.createObjectURL(blob);
            // 创建下载链接
            var a_1 = document.createElement('a');
            a_1.href = url_1;
            a_1.download = exportFilename;
            document.body.appendChild(a_1);
            a_1.click();
            // 清理
            setTimeout(function () {
                document.body.removeChild(a_1);
                URL.revokeObjectURL(url_1);
            }, 100);
            this.showToast("\u6587\u4EF6 ".concat(exportFilename, " \u5BFC\u51FA\u6210\u529F"));
        }
        catch (error) {
            this.showToast("\u5BFC\u51FA\u6587\u4EF6\u5931\u8D25: ".concat(error));
        }
    };
    MrpEditorUI.prototype.deleteFile = function (target) {
        var _a, _b;
        if (!this.mrpInfo)
            return;
        var row = target.closest('tr');
        if (!row)
            return;
        var fileName = (_b = (_a = row.querySelector('td:nth-child(2)')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
        if (!fileName)
            return;
        if (confirm("\u786E\u5B9A\u8981\u5220\u9664\u6587\u4EF6 \"".concat(fileName, "\" \u5417\uFF1F"))) {
            try {
                this.mrpInfo.remove(fileName);
                // 更新 UI
                this.updateFileListUI();
                this.updateBasicInfoUI();
                this.showToast('文件已删除！');
            }
            catch (error) {
                alert("\u5220\u9664\u6587\u4EF6\u5931\u8D25: ".concat(error));
                if (error instanceof Error) {
                    console.error(error.message);
                    console.error('错误堆栈:', error.stack); // 包含文件名和行号
                }
            }
        }
    };
    MrpEditorUI.prototype.showAboutModal = function () {
        var modal = document.getElementById('aboutModal');
        if (modal)
            modal.style.display = 'flex';
    };
    MrpEditorUI.prototype.hideAboutModal = function () {
        var modal = document.getElementById('aboutModal');
        if (modal)
            modal.style.display = 'none';
    };
    MrpEditorUI.prototype.openFile = function () {
        var _this = this;
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.mrp';
        input.onchange = function (e) {
            var _a;
            var file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
            if (!file)
                return;
            _this.currentFile = file;
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                try {
                    var fileData = new Uint8Array((_a = e.target) === null || _a === void 0 ? void 0 : _a.result);
                    _this.mrpInfo = mrpinfo_1.MrpInfo.fromBytes(fileData);
                    // 更新 UI
                    _this.updateFileInfoUI();
                    _this.updateFileListUI();
                    _this.updateBasicInfoUI();
                    _this.showToast('文件加载成功！');
                }
                catch (error) {
                    alert("\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ".concat(error));
                }
            };
            reader.readAsArrayBuffer(file);
        };
        input.click();
    };
    MrpEditorUI.prototype.saveFile = function () {
        if (!this.mrpInfo || !this.currentFile) {
            alert('没有可保存的文件！');
            return;
        }
        var blob = new Blob([this.mrpInfo.data], { type: 'application/octet-stream' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = this.currentFile.name || 'modified.mrp';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('文件保存成功！');
    };
    MrpEditorUI.prototype.updateFileInfoUI = function () {
        if (!this.mrpInfo)
            return;
        // 动态修改网页标题
        document.title = "[MRP\u7F16\u8F91\u5668] - ".concat(this.mrpInfo.displayName || this.mrpInfo.fileName);
        // 基本信息
        document.getElementById('basicDisplayName').textContent = this.mrpInfo.displayName;
        document.getElementById('basicVersion').textContent = this.mrpInfo.version.toString();
        document.getElementById('basicAuthStr').textContent = this.mrpInfo.vendor;
        // 详细信息
        document.getElementById('fileName').textContent = this.mrpInfo.fileName;
        document.getElementById('appid').textContent = this.mrpInfo.appid.toString();
        document.getElementById('builderVersion').textContent = this.mrpInfo.builderVersion.toString();
        document.getElementById('vendor').textContent = this.mrpInfo.vendor;
        document.getElementById('desc').textContent = this.mrpInfo.desc;
        document.getElementById('screenSize').textContent = "".concat(this.mrpInfo.screenWidth, "x").concat(this.mrpInfo.screenHeight);
        var platText = '未知';
        switch (this.mrpInfo.plat) {
            case 1:
                platText = 'MTK';
                break;
            case 2:
                platText = '展讯';
                break;
            case 3:
                platText = '其它';
                break;
        }
        document.getElementById('plat').textContent = platText;
        var fileSizeKB = (this.mrpInfo.data.length / 1024).toFixed(1);
        document.getElementById('fileSize').textContent = "".concat(fileSizeKB, " KB");
    };
    MrpEditorUI.prototype.updateBasicInfoUI = function () {
        if (!this.mrpInfo)
            return;
        document.getElementById('basicFileCount').textContent = this.mrpInfo.files.length.toString();
    };
    MrpEditorUI.prototype.setupClipboardListener = function () {
        var _this = this;
        window.addEventListener('paste', function (e) {
            if (!e.clipboardData || !e.clipboardData.items)
                return;
            var _loop_1 = function (i) {
                var item = e.clipboardData.items[i];
                if (item.kind === 'file') {
                    var file_2 = item.getAsFile();
                    if (file_2 && (file_2.name.toLowerCase().endsWith('.mrp') || file_2.name === 'blob')) {
                        _this.currentFile = file_2;
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            var _a;
                            try {
                                var fileData = new Uint8Array((_a = event.target) === null || _a === void 0 ? void 0 : _a.result);
                                _this.mrpInfo = mrpinfo_1.MrpInfo.fromBytes(fileData);
                                // 给无后缀的文件补充后缀展示
                                if (file_2.name === 'blob') {
                                    Object.defineProperty(file_2, 'name', { value: 'pasted_file.mrp', writable: false });
                                }
                                _this.updateFileInfoUI();
                                _this.updateFileListUI();
                                _this.updateBasicInfoUI();
                                _this.showToast('从剪切板加载MRP文件成功！');
                            }
                            catch (error) {
                                alert("\u526A\u5207\u677F\u6587\u4EF6\u89E3\u6790\u5931\u8D25: ".concat(error));
                            }
                        };
                        reader.readAsArrayBuffer(file_2);
                        return "break";
                    }
                }
            };
            for (var i = 0; i < e.clipboardData.items.length; i++) {
                var state_1 = _loop_1(i);
                if (state_1 === "break")
                    break;
            }
        });
    };
    MrpEditorUI.prototype.showDialog = function (title, contentHtml, onConfirm, onCancel) {
        var dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'modal';
        dialogOverlay.style.display = 'flex';
        dialogOverlay.style.zIndex = '9999';
        var dialogContent = document.createElement('div');
        dialogContent.className = 'modal-content';
        dialogContent.innerHTML = "\n            <div class=\"modal-header\">\n                <div class=\"modal-title\">".concat(title, "</div>\n                <button class=\"close-btn\">&times;</button>\n            </div>\n            <div style=\"padding: 15px 0;\">\n                ").concat(contentHtml, "\n            </div>\n            <div class=\"form-actions\">\n                <button type=\"button\" class=\"btn btn-secondary cancel-btn\">\u53D6\u6D88</button>\n                <button type=\"button\" class=\"btn btn-primary confirm-btn\">\u786E\u5B9A</button>\n            </div>\n        ");
        dialogOverlay.appendChild(dialogContent);
        document.body.appendChild(dialogOverlay);
        var closeDialog = function () {
            dialogOverlay.remove();
        };
        var confirmBtn = dialogContent.querySelector('.confirm-btn');
        var cancelBtn = dialogContent.querySelector('.cancel-btn');
        var closeBtn = dialogContent.querySelector('.close-btn');
        confirmBtn === null || confirmBtn === void 0 ? void 0 : confirmBtn.addEventListener('click', function () {
            if (onConfirm)
                onConfirm();
            closeDialog();
        });
        cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', function () {
            if (onCancel)
                onCancel();
            closeDialog();
        });
        closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', function () {
            if (onCancel)
                onCancel();
            closeDialog();
        });
    };
    MrpEditorUI.prototype.updateFileListUI = function () {
        if (!this.mrpInfo)
            return;
        var fileListBody = document.getElementById('fileListBody');
        if (!fileListBody)
            return;
        // 清空现有内容
        fileListBody.innerHTML = '';
        // 添加新内容
        this.mrpInfo.files.forEach(function (file, index) {
            var _a;
            var row = document.createElement('tr');
            // 获取文件图标类
            var fileIconClass = 'fa-file';
            var ext = (_a = file.filename.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            switch (ext) {
                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'bmp':
                    fileIconClass = 'fa-file-image';
                    break;
                case 'js':
                case 'json':
                case 'xml':
                case 'html':
                case 'css':
                    fileIconClass = 'fa-file-code';
                    break;
                case 'mp3':
                case 'wav':
                case 'ogg':
                    fileIconClass = 'fa-file-audio';
                    break;
                case 'zip':
                case 'rar':
                case '7z':
                    fileIconClass = 'fa-file-archive';
                    break;
                case 'txt':
                case 'ini':
                case 'conf':
                    fileIconClass = 'fa-file-alt';
                    break;
            }
            var fileSizeKB = (file.fileLen / 1024).toFixed(1);
            var offsetHex = "0x".concat(file.fileOffset.toString(16).toUpperCase().padStart(8, '0'));
            row.innerHTML = "\n            <td>".concat(index + 1, "</td>\n            <td><i class=\"fas ").concat(fileIconClass, " file-icon\"></i> ").concat(file.filename, "</td>\n            <td>").concat(offsetHex, "</td>\n            <td>").concat(fileSizeKB, " KB</td>\n            <td>\n                <div class=\"file-actions\">\n                    <button class=\"action-btn view-btn\" title=\"\u67E5\u770B\"><i class=\"fas fa-eye\"></i></button>\n                    <button class=\"action-btn export-btn\" title=\"\u5BFC\u51FA\"><i class=\"fas fa-download\"></i></button>\n                    <button class=\"action-btn delete-btn\" title=\"\u5220\u9664\"><i class=\"fas fa-trash\"></i></button>\n                </div>\n            </td>\n        ");
            fileListBody.appendChild(row);
        });
    };
    return MrpEditorUI;
}());
// 初始化应用
document.addEventListener('DOMContentLoaded', function () {
    new MrpEditorUI();
});


/***/ }),

/***/ 996:
/***/ ((module) => {

"use strict";
// String encode/decode helpers



// Quick check if we can use fast array to bin string conversion
//
// - apply(Array) can fail on Android 2.2
// - apply(Uint8Array) can fail on iOS 5.1 Safari
//
let STR_APPLY_UIA_OK = true;

try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }


// Table with utf8 lengths (calculated by first byte of sequence)
// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
// because max possible codepoint is 0x10ffff
const _utf8len = new Uint8Array(256);
for (let q = 0; q < 256; q++) {
  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
}
_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start


// convert string to array (typed, when possible)
module.exports.string2buf = (str) => {
  if (typeof TextEncoder === 'function' && TextEncoder.prototype.encode) {
    return new TextEncoder().encode(str);
  }

  let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;

  // count binary size
  for (m_pos = 0; m_pos < str_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }

  // allocate buffer
  buf = new Uint8Array(buf_len);

  // convert
  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
    c = str.charCodeAt(m_pos);
    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
      c2 = str.charCodeAt(m_pos + 1);
      if ((c2 & 0xfc00) === 0xdc00) {
        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
        m_pos++;
      }
    }
    if (c < 0x80) {
      /* one byte */
      buf[i++] = c;
    } else if (c < 0x800) {
      /* two bytes */
      buf[i++] = 0xC0 | (c >>> 6);
      buf[i++] = 0x80 | (c & 0x3f);
    } else if (c < 0x10000) {
      /* three bytes */
      buf[i++] = 0xE0 | (c >>> 12);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    } else {
      /* four bytes */
      buf[i++] = 0xf0 | (c >>> 18);
      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
      buf[i++] = 0x80 | (c & 0x3f);
    }
  }

  return buf;
};

// Helper
const buf2binstring = (buf, len) => {
  // On Chrome, the arguments in a function call that are allowed is `65534`.
  // If the length of the buffer is smaller than that, we can use this optimization,
  // otherwise we will take a slower path.
  if (len < 65534) {
    if (buf.subarray && STR_APPLY_UIA_OK) {
      return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
    }
  }

  let result = '';
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
};


// convert array to string
module.exports.buf2string = (buf, max) => {
  const len = max || buf.length;

  if (typeof TextDecoder === 'function' && TextDecoder.prototype.decode) {
    return new TextDecoder().decode(buf.subarray(0, max));
  }

  let i, out;

  // Reserve max possible length (2 words per char)
  // NB: by unknown reasons, Array is significantly faster for
  //     String.fromCharCode.apply than Uint16Array.
  const utf16buf = new Array(len * 2);

  for (out = 0, i = 0; i < len;) {
    let c = buf[i++];
    // quick process ascii
    if (c < 0x80) { utf16buf[out++] = c; continue; }

    let c_len = _utf8len[c];
    // skip 5 & 6 byte codes
    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }

    // apply mask on first byte
    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
    // join the rest
    while (c_len > 1 && i < len) {
      c = (c << 6) | (buf[i++] & 0x3f);
      c_len--;
    }

    // terminated by end of string?
    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

    if (c < 0x10000) {
      utf16buf[out++] = c;
    } else {
      c -= 0x10000;
      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
    }
  }

  return buf2binstring(utf16buf, out);
};


// Calculate max possible position in utf8 buffer,
// that will not break sequence. If that's not possible
// - (very small limits) return max size as is.
//
// buf[] - utf8 bytes array
// max   - length limit (mandatory);
module.exports.utf8border = (buf, max) => {

  max = max || buf.length;
  if (max > buf.length) { max = buf.length; }

  // go back from last position, until start of sequence found
  let pos = max - 1;
  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }

  // Very small and broken sequence,
  // return max, because we should return something anyway.
  if (pos < 0) { return max; }

  // If we came to start of buffer - that means buffer is too small,
  // return max too.
  if (pos === 0) { return max; }

  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
};


/***/ }),

/***/ 998:
/***/ ((module) => {

"use strict";


// (C) 1995-2013 Jean-loup Gailly and Mark Adler
// (C) 2014-2017 Vitaly Puzrin and Andrey Tupitsin
//
// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.
//
// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:
//
// 1. The origin of this software must not be misrepresented; you must not
//   claim that you wrote the original software. If you use this software
//   in a product, an acknowledgment in the product documentation would be
//   appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//   misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const MAXBITS = 15;
const ENOUGH_LENS = 852;
const ENOUGH_DISTS = 592;
//const ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);

const CODES = 0;
const LENS = 1;
const DISTS = 2;

const lbase = new Uint16Array([ /* Length codes 257..285 base */
  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
]);

const lext = new Uint8Array([ /* Length codes 257..285 extra */
  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
]);

const dbase = new Uint16Array([ /* Distance codes 0..29 base */
  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
  8193, 12289, 16385, 24577, 0, 0
]);

const dext = new Uint8Array([ /* Distance codes 0..29 extra */
  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
  28, 28, 29, 29, 64, 64
]);

const inflate_table = (type, lens, lens_index, codes, table, table_index, work, opts) =>
{
  const bits = opts.bits;
      //here = opts.here; /* table entry for duplication */

  let len = 0;               /* a code's length in bits */
  let sym = 0;               /* index of code symbols */
  let min = 0, max = 0;          /* minimum and maximum code lengths */
  let root = 0;              /* number of index bits for root table */
  let curr = 0;              /* number of index bits for current table */
  let drop = 0;              /* code bits to drop for sub-table */
  let left = 0;                   /* number of prefix codes available */
  let used = 0;              /* code entries in table used */
  let huff = 0;              /* Huffman code */
  let incr;              /* for incrementing code, index */
  let fill;              /* index for replicating entries */
  let low;               /* low bits for current root entry */
  let mask;              /* mask for low root bits */
  let next;             /* next available space in table */
  let base = null;     /* base value table to use */
//  let shoextra;    /* extra bits table to use */
  let match;                  /* use base and extra for symbol >= match */
  const count = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
  const offs = new Uint16Array(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
  let extra = null;

  let here_bits, here_op, here_val;

  /*
   Process a set of code lengths to create a canonical Huffman code.  The
   code lengths are lens[0..codes-1].  Each length corresponds to the
   symbols 0..codes-1.  The Huffman code is generated by first sorting the
   symbols by length from short to long, and retaining the symbol order
   for codes with equal lengths.  Then the code starts with all zero bits
   for the first code of the shortest length, and the codes are integer
   increments for the same length, and zeros are appended as the length
   increases.  For the deflate format, these bits are stored backwards
   from their more natural integer increment ordering, and so when the
   decoding tables are built in the large loop below, the integer codes
   are incremented backwards.

   This routine assumes, but does not check, that all of the entries in
   lens[] are in the range 0..MAXBITS.  The caller must assure this.
   1..MAXBITS is interpreted as that code length.  zero means that that
   symbol does not occur in this code.

   The codes are sorted by computing a count of codes for each length,
   creating from that a table of starting indices for each length in the
   sorted table, and then entering the symbols in order in the sorted
   table.  The sorted table is work[], with that space being provided by
   the caller.

   The length counts are used for other purposes as well, i.e. finding
   the minimum and maximum length codes, determining if there are any
   codes at all, checking for a valid set of lengths, and looking ahead
   at length counts to determine sub-table sizes when building the
   decoding tables.
   */

  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
  for (len = 0; len <= MAXBITS; len++) {
    count[len] = 0;
  }
  for (sym = 0; sym < codes; sym++) {
    count[lens[lens_index + sym]]++;
  }

  /* bound code lengths, force root to be within code lengths */
  root = bits;
  for (max = MAXBITS; max >= 1; max--) {
    if (count[max] !== 0) { break; }
  }
  if (root > max) {
    root = max;
  }
  if (max === 0) {                     /* no symbols to code at all */
    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;


    //table.op[opts.table_index] = 64;
    //table.bits[opts.table_index] = 1;
    //table.val[opts.table_index++] = 0;
    table[table_index++] = (1 << 24) | (64 << 16) | 0;

    opts.bits = 1;
    return 0;     /* no symbols, but wait for decoding to report error */
  }
  for (min = 1; min < max; min++) {
    if (count[min] !== 0) { break; }
  }
  if (root < min) {
    root = min;
  }

  /* check for an over-subscribed or incomplete set of lengths */
  left = 1;
  for (len = 1; len <= MAXBITS; len++) {
    left <<= 1;
    left -= count[len];
    if (left < 0) {
      return -1;
    }        /* over-subscribed */
  }
  if (left > 0 && (type === CODES || max !== 1)) {
    return -1;                      /* incomplete set */
  }

  /* generate offsets into symbol table for each length for sorting */
  offs[1] = 0;
  for (len = 1; len < MAXBITS; len++) {
    offs[len + 1] = offs[len] + count[len];
  }

  /* sort symbols by length, by symbol order within each length */
  for (sym = 0; sym < codes; sym++) {
    if (lens[lens_index + sym] !== 0) {
      work[offs[lens[lens_index + sym]]++] = sym;
    }
  }

  /*
   Create and fill in decoding tables.  In this loop, the table being
   filled is at next and has curr index bits.  The code being used is huff
   with length len.  That code is converted to an index by dropping drop
   bits off of the bottom.  For codes where len is less than drop + curr,
   those top drop + curr - len bits are incremented through all values to
   fill the table with replicated entries.

   root is the number of index bits for the root table.  When len exceeds
   root, sub-tables are created pointed to by the root entry with an index
   of the low root bits of huff.  This is saved in low to check for when a
   new sub-table should be started.  drop is zero when the root table is
   being filled, and drop is root when sub-tables are being filled.

   When a new sub-table is needed, it is necessary to look ahead in the
   code lengths to determine what size sub-table is needed.  The length
   counts are used for this, and so count[] is decremented as codes are
   entered in the tables.

   used keeps track of how many table entries have been allocated from the
   provided *table space.  It is checked for LENS and DIST tables against
   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
   the initial root table size constants.  See the comments in inftrees.h
   for more information.

   sym increments through all symbols, and the loop terminates when
   all codes of length max, i.e. all codes, have been processed.  This
   routine permits incomplete codes, so another loop after this one fills
   in the rest of the decoding tables with invalid code markers.
   */

  /* set up for code type */
  // poor man optimization - use if-else instead of switch,
  // to avoid deopts in old v8
  if (type === CODES) {
    base = extra = work;    /* dummy value--not used */
    match = 20;

  } else if (type === LENS) {
    base = lbase;
    extra = lext;
    match = 257;

  } else {                    /* DISTS */
    base = dbase;
    extra = dext;
    match = 0;
  }

  /* initialize opts for loop */
  huff = 0;                   /* starting code */
  sym = 0;                    /* starting code symbol */
  len = min;                  /* starting code length */
  next = table_index;              /* current table to fill in */
  curr = root;                /* current table index bits */
  drop = 0;                   /* current bits to drop from code for index */
  low = -1;                   /* trigger new sub-table when len > root */
  used = 1 << root;          /* use root table entries */
  mask = used - 1;            /* mask for comparing low */

  /* check available table space */
  if ((type === LENS && used > ENOUGH_LENS) ||
    (type === DISTS && used > ENOUGH_DISTS)) {
    return 1;
  }

  /* process all codes and make table entries */
  for (;;) {
    /* create table entry */
    here_bits = len - drop;
    if (work[sym] + 1 < match) {
      here_op = 0;
      here_val = work[sym];
    }
    else if (work[sym] >= match) {
      here_op = extra[work[sym] - match];
      here_val = base[work[sym] - match];
    }
    else {
      here_op = 32 + 64;         /* end of block */
      here_val = 0;
    }

    /* replicate for those indices with low len bits equal to huff */
    incr = 1 << (len - drop);
    fill = 1 << curr;
    min = fill;                 /* save offset to next table */
    do {
      fill -= incr;
      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
    } while (fill !== 0);

    /* backwards increment the len-bit code huff */
    incr = 1 << (len - 1);
    while (huff & incr) {
      incr >>= 1;
    }
    if (incr !== 0) {
      huff &= incr - 1;
      huff += incr;
    } else {
      huff = 0;
    }

    /* go to next symbol, update count, len */
    sym++;
    if (--count[len] === 0) {
      if (len === max) { break; }
      len = lens[lens_index + work[sym]];
    }

    /* create new sub-table if needed */
    if (len > root && (huff & mask) !== low) {
      /* if first time, transition to sub-tables */
      if (drop === 0) {
        drop = root;
      }

      /* increment past last table */
      next += min;            /* here min is 1 << curr */

      /* determine length of next table */
      curr = len - drop;
      left = 1 << curr;
      while (curr + drop < max) {
        left -= count[curr + drop];
        if (left <= 0) { break; }
        curr++;
        left <<= 1;
      }

      /* check for enough space */
      used += 1 << curr;
      if ((type === LENS && used > ENOUGH_LENS) ||
        (type === DISTS && used > ENOUGH_DISTS)) {
        return 1;
      }

      /* point entry in root table to sub-table */
      low = huff & mask;
      /*table.op[low] = curr;
      table.bits[low] = root;
      table.val[low] = next - opts.table_index;*/
      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
    }
  }

  /* fill in remaining table entry if code is incomplete (guaranteed to have
   at most one remaining entry, since if the code is incomplete, the
   maximum code length that was allowed to get this far is one bit) */
  if (huff !== 0) {
    //table.op[next + huff] = 64;            /* invalid code marker */
    //table.bits[next + huff] = len - drop;
    //table.val[next + huff] = 0;
    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
  }

  /* set return parameters */
  //opts.table_index += used;
  opts.bits = root;
  return 0;
};


module.exports = inflate_table;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(895);
/******/ 	
/******/ })()
;