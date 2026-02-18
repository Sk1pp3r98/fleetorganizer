export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path") ?? ""
  const query = getQuery(event)

  const base = "https://api.fleetyards.net/v1"

  return await $fetch(`${base}/${path}`, {
    method: "GET",
    query,
    headers: { accept: "application/json" },
  })
})
