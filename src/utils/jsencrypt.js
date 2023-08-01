import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDde67SxKBtF' +
    'GsVrahNzWa7PllWRmL/ANJc+/8aF42gxMC3fGXdsxCZ8D7+p6ikSVcjnBosfsk9w' +
    'Pk0XocPmFKtSKyPm6e6KyqyCH9hBLBwZl/KCwuoHfimIEkTmKxOeirF1EVvjUW9P' +
    '7csgOvsiAiFyp0pFFji/8dB/todY9gwQIDAQAB'

const privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBA' +
    'MN17rtLEoG0UaxWtqE3NZrs+WVZGYv8A0lz7/xoXjaDEwLd8Zd2zEJnwPv6nqKRJ' +
    'VyOcGix+yT3A+TRehw+YUq1IrI+bp7orKrIIf2EEsHBmX8oLC6gd+KYgSROYrE56' +
    'KsXURW+NRb0/tyyA6+yICIXKnSkUWOL/x0H+2h1j2DBAgMBAAECgYB44nMneqKTf' +
    'UYV4/tHcbHBg1YrDBP0s4QE5aNC4/mAlUgoucM0/dAOMcT1EmcR+9qzh5SV6517m' +
    'xnZZoSy+xGH4UTxK0q0iZGQ+mT+oBRYwmmagGLwr88gPjW2BdGC3addlc7iFYjp3' +
    'RIgxmES5GK52lT2OiatpawiEj4s2u/bkQJBAPGIttUKgvlI6O5QHLsSmFJE9bMck' +
    'sGIX7B0jwVuPXUCDzpWXcz3v4VCGNaaKrt32FxBWTTgXa8W/Z6SDW2a5FsCQQDPK' +
    's4co8z7wXh1j1OHBICAnwJonzpVoIKyJhKyyedBkIOTvHGHakPEwDB2uTggYh2jR' +
    'V4jSkTrbBp4ZDuSBKoTAkBcl/CfU1xKfKzvTz70aHiEcXNPqtCH6OPmHYkGp/Bff' +
    't6fmqRzAzckuuYSvx9KpvMGyvaL0seXa9TmiU8kiZCpAkANt0TMKqAgru99wQ6Dq' +
    'u2jFmP/b0NadfURPGoSgkGYWqwLdPeDQqrX9O2AfsTTiAt0Stxvs7Qabh7Wh7RV9' +
    '48XAkEA7gq5j4L07NOQ5ihbrvYVFfIoaxO38pSUGnkROootFSnfsRk7srLi7fYBW' +
    'mWLkeYEeoNL3Kxr8jmM+1xlTFPXHA==';

// 加密
export function encrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
    const encryptor = new JSEncrypt()
    encryptor.setPrivateKey(privateKey) // 设置私钥
    return encryptor.decrypt(txt) // 对数据进行解密
}
