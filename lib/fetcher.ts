export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = "ApiError"
  }
}

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new ApiError(res.status, `${res.status}: ${res.statusText}`)
  }
  return res.json()
}
