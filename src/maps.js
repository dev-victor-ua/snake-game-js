export async function getMap(id) {
  try {
    const response = await fetch(`/maps/${id}.json`);

    return await response.json();
  } catch (e) {
    // Empty
  }

  return [];
}
