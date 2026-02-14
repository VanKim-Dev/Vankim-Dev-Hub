interface CryptoHeaderProps {
  title: string;
  description: string;
}

export default function CryptoHeader({ title, description }: CryptoHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}