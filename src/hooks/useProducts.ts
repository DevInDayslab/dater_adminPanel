import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminApi } from "@/lib/api"
import type { ProductConfiguration } from "@/types"

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => adminApi.listProducts(),
  })
}

export function useUpdateAdminProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (products: Array<Partial<ProductConfiguration> & { packCode: string }>) =>
      adminApi.updateProducts(products),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] })
    },
  })
}
