import CryptoJS from './crypto.js'
// 定义加/解密的 key(key都放这里了, 加密还有啥意义!^_^)
// const initKey = '123!@#';
// 设置数据块长度
const keySize = 128;
/**
 * 生成密钥字节数组, 原始密钥字符串不足128位, 补填0.
 * @param {string} key - 原始 key 值
 * @return Buffer
 */
const fillKey = (key) => {
  // const filledKey = Buffer.alloc(keySize / 8);
  // const keys = Buffer.from(key);
  // if (keys.length < filledKey.length) {
  //   filledKey.map((b, i) => filledKey[i] = keys[i]);
  // }
  // return filledKey;
  // var iv = CryptoJS.lib.WordArray.random(keySize / 8).toString(key)
  var filledKey = CryptoJS.enc.Hex.parse(key)
  console.log('filledKey', filledKey)
  return filledKey
}
/**
 * 定义加密函数
 * @param {string} data - 需要加密的数据, 传过来前先进行 JSON.stringify(data);
 * @param {string} key - 加密使用的 key
 */
const aesEncrypt = (data, initKey) => {
  // data = JSON.stringify(data)
  // const key = CryptoJS.enc.Utf8.parse(fillKey(initKey));
  const key = fillKey(initKey)
  /**
   * CipherOption, 加密的一些选项:
   *   mode: 加密模式, 可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB), 都在 CryptoJS.mode 对象下
   *   padding: 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding), 都在 CryptoJS.pad 对象下
   *   iv: 偏移量, mode === ECB 时, 不需要 iv
   * 返回的是一个加密对象
   */
  const cipher = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: key,
  });
  // 将加密后的数据转换成 Base64
  const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
  // 处理 Android 某些低版的BUG
  const resultCipher = base64Cipher.replace(/\+/g, '-').replace(/\//g, '_');
  // 返回加密后的经过处理的 Base64
  // return resultCipher;
  return cipher.ciphertext.toString()
}
/**
 * 定义解密函数
 * @param {string} encrypted - 加密的数据;
 * @param {string} key - 加密使用的 key
 */
const aesDecrypt = (encrypted, initKey) => {
  // const key = CryptoJS.enc.Utf8.parse(initKey);
  const key = fillKey(initKey)
  // 先将 Base64 还原一下, 因为加密的时候做了一些字符的替换
  const restoreBase64 = encrypted.replace(/\-/g, '+').replace(/_/g, '/');
  // 这里 mode, padding, iv 一定要跟加密的时候完全一样
  // 返回的是一个解密后的对象
  const decipher = CryptoJS.AES.decrypt(encrypted, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: key,
  });
  // 将解密对象转换成 UTF8 的字符串
  // const resultDecipher = CryptoJS.enc.Utf8.stringify(decipher);
  // 返回解密结果
  return decipher;
}
// 获取填充后的key
// const key = CryptoJS.enc.Utf8.parse(fillKey(initKey));

// // 定义需要加密的数据
// const data = { "password": "qwe123!@#", "userName": "wing@email.com" };
// // 调用加密函数
// const encrypted = aesEncrypt(JSON.stringify(data), key);
// // 调用解密函数
// const decrypted = aesDecrypt(encrypted, key);
// // 控制台输出查看结果
// console.log('加密结果: ', encrypted);
// console.log('解密结果: ', decrypted);
module.exports = {
  aesEncrypt,
  aesDecrypt
}