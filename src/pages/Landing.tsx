import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Map, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden selection:bg-primary/20">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-info/10 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-10 border-b border-border/40 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              Manager<span className="text-primary font-light">Pro</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/app">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105 flex items-center gap-2">
                  <span>Mon Espace</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                  Se connecter
                </Link>
                <Link to="/auth">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105">
                    S'abonner
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Nouvelle version 2.0 disponible
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Pilotez votre flotte avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-info">précision.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              La plateforme ultime pour optimiser la gestion de vos véhicules. Suivi en temps réel, entretiens automatisés et maîtrise totale des coûts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              {user ? (
                <Link to="/app">
                  <Button className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/30 group transition-all hover:scale-105">
                    Accéder à mon tableau de bord
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth">
                    <Button className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/30 group transition-all hover:scale-105">
                      S'abonner maintenant
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" className="h-14 px-8 rounded-full font-bold text-lg border-border/50 hover:bg-muted/50 transition-all bg-transparent">
                      Espace Client
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-6 justify-center lg:justify-start pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> Sans engagement
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" /> Déploiement instantané
              </div>
            </div>
          </div>

          {/* Right Content / Dashboard Abstract Visual */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-fade-in-up stagger-2">
            <div className="relative rounded-2xl bg-card border border-border/50 shadow-2xl overflow-hidden aspect-square sm:aspect-video lg:aspect-square flex items-center justify-center p-8 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              
              {/* Realistic UI representation */}
              <div className="w-full h-full border border-border/50 rounded-xl bg-background shadow-sm flex flex-col p-4 gap-4 relative z-10 overflow-hidden">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">Tableau de bord</span>
                    <span className="text-[10px] text-muted-foreground">Aperçu en temps réel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary">MP</span>
                    </div>
                  </div>
                </div>
                
                {/* Real-looking Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-card border border-border/50 flex flex-col p-3 shadow-sm hover:border-primary/50 transition-colors cursor-default">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-muted-foreground">Véhicules Total</span>
                      <Car className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xl font-bold text-foreground">142</span>
                    <span className="text-[9px] text-success font-medium mt-1">+12% ce mois</span>
                  </div>
                  <div className="rounded-lg bg-card border border-border/50 flex flex-col p-3 shadow-sm hover:border-info/50 transition-colors cursor-default">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-medium text-muted-foreground">Disponibilité</span>
                      <Activity className="h-3.5 w-3.5 text-info" />
                    </div>
                    <span className="text-xl font-bold text-foreground">94%</span>
                    <span className="text-[9px] text-success font-medium mt-1">+2.4% ce mois</span>
                  </div>
                </div>
                
                {/* Real-looking Graph Area */}
                <div className="flex-1 rounded-lg border border-border/50 p-3 flex flex-col gap-2 bg-card shadow-sm cursor-default">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-semibold text-foreground">Activité de la flotte</span>
                     <span className="text-[9px] text-muted-foreground">7 derniers jours</span>
                  </div>
                  <div className="flex-1 flex items-end gap-1.5 pt-2">
                     {[40, 70, 45, 90, 65, 85, 60].map((h, i) => (
                       <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative h-full">
                         <div className="w-full bg-primary/20 rounded-t-sm transition-all group-hover:bg-primary absolute bottom-0" style={{ height: `${h}%` }}>
                           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm pointer-events-none z-20">
                             {Math.floor(h * 1.5)} trajets
                           </div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -right-6 -bottom-6 bg-card border border-border/50 p-4 rounded-xl shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-bold text-sm">Flotte Sécurisée</p>
                  <p className="text-xs text-muted-foreground">100% des véhicules</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 bg-card/30 border-t border-border/50 py-24 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Tout ce dont vous avez besoin.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manager Pro regroupe tous les outils essentiels pour la gestion de votre parc automobile en une seule interface intuitive.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Suivi en Temps Réel</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualisez l'état, le kilométrage et la disponibilité de chaque véhicule instantanément.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center mb-6">
                <Map className="h-6 w-6 text-info" />
              </div>
              <h3 className="text-xl font-bold mb-3">Gestion des Trajets</h3>
              <p className="text-muted-foreground leading-relaxed">
                Optimisez les réservations et contrôlez l'utilisation du carburant avec des rapports précis.
              </p>
            </div>

            <div className="bg-background p-8 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-3">Entretiens Proactifs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Soyez alerté avant qu'une panne ne survienne. Planifiez les révisions automatiquement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 py-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Car className="h-5 w-5 opacity-50" />
          <span className="font-bold tracking-tight">Manager Pro</span>
        </div>
        <p className="text-sm">© 2026 Manager Pro. Tous droits réservés. Créé par <strong>Netwave Studio</strong>.</p>
      </footer>
    </div>
  );
};

export default Landing;
