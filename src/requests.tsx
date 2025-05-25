import { REGISTRY_URL, DETAIL, CAS_RN } from "../cas_registry.json";

export async function getSocName(socId) {
  try {
    const target = `${REGISTRY_URL}${DETAIL}?${CAS_RN}=${socId}`;
    const response = await fetch(target);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
    return { name: "-" };
  }
}
