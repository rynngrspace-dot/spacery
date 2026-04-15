"use server";

export async function getCoffeeCount() {
  const GET_URL = "https://api.counterapi.dev/v1/spacery/java-coffee-buzz";
  try {
    const res = await fetch(GET_URL, { cache: 'no-store' });
    const data = await res.json();
    return data?.count ?? 0;
  } catch (error) {
    console.error("Error fetching coffee count from server:", error);
    return 0;
  }
}

export async function incrementCoffeeCount() {
  const API_URL = "https://api.counterapi.dev/v1/spacery/java-coffee-buzz/up";
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    const data = await res.json();
    return data?.count ?? null;
  } catch (error) {
    console.error("Error incrementing coffee count from server:", error);
    return null;
  }
}
