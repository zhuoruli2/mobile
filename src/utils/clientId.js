import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@carnews/clientId';

function randomHex(bytes = 16) {
  const arr = Array.from({ length: bytes }, () => Math.floor(Math.random() * 256));
  return arr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getClientId() {
  let id = await AsyncStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = randomHex(16);
    await AsyncStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export default getClientId;

