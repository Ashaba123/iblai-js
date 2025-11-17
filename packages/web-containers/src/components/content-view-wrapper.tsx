type Props = {
  children: React.ReactNode;
  currentSPA: string | undefined;
  spas: string[];
};

export function ContentViewWrapper({ currentSPA, spas, children }: Props) {
  const shouldRender = spas.includes(currentSPA || '');

  if (!shouldRender) return null;

  return children;
}
