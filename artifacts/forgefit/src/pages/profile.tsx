import { useGetProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { data: profile, isLoading } = useGetProfile();

  if (isLoading) {
    return <div className="text-primary text-xl tracking-widest animate-pulse p-10">ACCESSING HUNTER DATABASE...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header>
        <h1 className="text-4xl font-bold text-primary tracking-widest uppercase drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]">
          Hunter Profile
        </h1>
        <p className="text-muted-foreground tracking-widest mt-2">
          BIOMETRIC DATA & OBJECTIVES
        </p>
      </header>

      <Card className="bg-card/40 border-primary/20">
        <CardHeader>
          <CardTitle className="tracking-widest uppercase text-lg border-b border-primary/20 pb-4">Personal Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Designation (Name)</label>
            <Input defaultValue={profile?.name} className="bg-background/50 border-primary/30 font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Age</label>
            <Input type="number" defaultValue={profile?.age} className="bg-background/50 border-primary/30 font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Current Weight (KG)</label>
            <Input type="number" defaultValue={profile?.currentWeight} className="bg-background/50 border-primary/30 font-mono text-primary font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Target Weight (KG)</label>
            <Input type="number" defaultValue={profile?.targetWeight} className="bg-background/50 border-primary/30 font-mono text-green-400 font-bold" />
          </div>
          <div className="col-span-full pt-4">
            <Button className="w-full bg-primary/20 hover:bg-primary/40 border border-primary/50 text-primary hover:text-white font-bold tracking-[0.2em] shadow-[0_0_10px_rgba(139,92,246,0.3)]">
              UPDATE BIOMETRICS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
