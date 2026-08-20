import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: t('auth.errors.loginFailed'),
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('auth.success.welcome'),
            description: t('auth.success.login'),
          });
          navigate('/');
        }
      } else {
        if (!fullName.trim()) {
          toast({
            title: t('common.error'),
            description: t('auth.errors.fullNameRequired'),
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: t('auth.errors.registerFailed'),
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t('auth.success.accountCreated'),
            description: t('auth.success.canLoginNow'),
          });
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('auth.errors.unexpected'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background font-sans overflow-hidden">
      
      {/* Left Panel - Visual/Brand (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 lg:p-16 xl:p-24 overflow-hidden border-r border-border/40 bg-card">
        {/* Abstract Background Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-info/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-3xl font-black tracking-tight text-foreground">
              Manager<span className="text-primary font-light">Pro</span>
            </span>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6 animate-fade-in-up stagger-1">
          <h2 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight text-foreground">
            Gérez votre flotte avec <span className="text-primary">élégance</span> et efficacité.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Rejoignez Manager Pro et découvrez l'outil ultime pour le suivi de vos véhicules, entretiens, alertes et chauffeurs. 
            Une interface pensée pour les professionnels.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 animate-fade-in-up stagger-2">
          <p className="text-sm font-medium text-muted-foreground">© 2026 Manager Pro. Tous droits réservés. Créé par <strong>Netwave Studio</strong>.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        
        {/* Mobile Background Elements */}
        <div className="absolute inset-0 z-0 lg:hidden">
           <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="w-full max-w-[420px] space-y-8 relative z-10">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10 animate-fade-in-up">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tight text-foreground">
              Manager<span className="text-primary font-light">Pro</span>
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-2 text-center lg:text-left animate-fade-in-up">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? t('auth.titleLogin') : t('auth.titleRegister')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLogin 
                ? "Heureux de vous revoir ! Connectez-vous pour continuer." 
                : "Créez votre compte en quelques secondes et rejoignez-nous."}
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-card/50 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-6 sm:p-8 lg:p-0 rounded-3xl lg:rounded-none border lg:border-none border-border/50 shadow-xl lg:shadow-none animate-fade-in-up stagger-1">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold">{t('auth.fullName')}</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t('auth.fullNamePlaceholder')}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-border/50 transition-all duration-200"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">{t('auth.email')}</Label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-background/50 focus:bg-background border-border/50 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold">{t('auth.password')}</Label>
                  {isLogin && (
                    <a href="#" className="text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
                      Mot de passe oublié ?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 rounded-xl bg-background/50 focus:bg-background border-border/50 transition-all duration-200"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {isLogin ? t('auth.loginButton') : t('auth.registerButton')}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-bold text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none"
                >
                  {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                </button>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Auth;
