export type StockCheckItem = {
  id: string;
  quantity: number;
  stock?: number;
};

export function validateCartItems(items: StockCheckItem[]) {
  const issues = items.filter((item) => {
    const quantity = Number(item.quantity ?? 0);
    const stock = Number(item.stock ?? 0);

    return !item.id || quantity <= 0 || stock <= 0 || quantity > stock;
  });

  return {
    ok: issues.length === 0,
    issues,
  };
}
