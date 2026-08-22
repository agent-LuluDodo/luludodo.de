export default function from_mutf8(bytes: number[]): string {
    const result: number[] = []
    let multi = 0
    let high_surrogate = false
    let low_surrogate = false
    let value = 0
    for (const byte of bytes) {
        if ((byte | 0xFF) != 0xFF) {             // number not a byte
            result.push(0xFFFD)
            multi = 0
            high_surrogate = false
            low_surrogate = false
        } else if (byte & 0x80) {                // 1xxxxxxx
            if (byte & 0x40) {                   // 11xxxxxx
                if (byte & 0x20) {               // 111xxxxx
                    if (byte & 0x10) {           // 1111xxxx - invalid
                        high_surrogate = false
                        low_surrogate = false
                        multi = 0
                        result.push(0xFFFD)
                    } else if (byte == 0xED) {   // 11101101
                        if (low_surrogate && multi == 3) {
                            high_surrogate = false
                            low_surrogate = true
                            multi--
                        } else if (!low_surrogate && !high_surrogate && multi == 0) {
                            high_surrogate = true
                            multi = 3
                            value = 0x10000
                        } else {
                            high_surrogate = false
                            low_surrogate = false
                            multi = 0
                            result.push(0xFFFD)
                        }
                    } else {                     // 1110xxxx
                        if (high_surrogate || low_surrogate || multi != 0) {
                            high_surrogate = false
                            low_surrogate = false
                            multi = 0
                            result.push(0xFFFD)
                        } else {
                            multi = 2
                            value = byte & 0x0F
                        }
                    }
                } else {                         // 110xxxxx
                    if (high_surrogate || low_surrogate || multi != 0) {
                        high_surrogate = false
                        low_surrogate = false
                        multi = 0
                        result.push(0xFFFD)
                    } else {
                        multi = 1
                        value = byte & 0x1F
                    }
                }
            } else if (multi > 0) {              // 10xxxxxx
                if (high_surrogate && multi == 2) {
                    if ((byte & 0xF0) == 0xA0) { // 1010xxx
                        value += byte & 0x0F
                    } else {
                        high_surrogate = false
                        multi = 1
                        value = 0xFFFD
                    }
                } else if (low_surrogate && multi == 2) {
                    if ((byte & 0xF0) == 0xB0) { // 1011xxx
                        value <<= 4
                        value += byte & 0x0F
                    } else {
                        low_surrogate = false
                        multi = 1
                        value = 0xFFFD
                    }
                } else {
                    value <<= 6
                    value += byte & 0x3F
                }
                if (--multi == 0) {
                    result.push(value)
                }
            } else {
                high_surrogate = false
                low_surrogate = false
                multi = 0
                result.push(0xFFFD)
            }
        } else {                                 // 0xxxxxxx
            if (high_surrogate || low_surrogate || multi != 0) {
                multi = 0
                high_surrogate = false
                low_surrogate = false
                result.push(0xFFFD)
            }
            result.push(byte)
        }
    }
    return String.fromCodePoint(...result)
}