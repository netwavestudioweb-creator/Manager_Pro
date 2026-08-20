import { useState, useEffect, useRef } from 'react';
import { User, Bell, Shield, Database, Palette, Save, Loader2, Building, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProfile, useUpdateProfile, useUpdatePassword } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { usePreferences } from '@/contexts/PreferencesContext';

type Tab = 'profile' | 'company' | 'security' | 'notifications' | 'preferences' | 'session';

const Settings = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const { role, signOut } = useAuth();
  const { toast } = useToast();
  const { language, setLanguage, currency, setCurrency } = usePreferences();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
  });

  const [companyData, setCompanyData] = useState({
    name: 'Manager Pro',
    address: '123 Avenue de la Flotte, 75000 Paris',
    phone: '+33 1 23 45 67 89',
    siret: '123 456 789 00012'
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
      });
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        full_name: formData.full_name,
      });
      toast({
        title: t("settings.success.profile"),
        description: t("settings.success.profileDesc"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      toast({
        title: t("settings.success.company"),
        description: t("settings.success.companyDesc"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: t("common.error"),
        description: t("settings.security.passwordMismatch"),
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: t("common.error"),
        description: t("settings.security.passwordLength"),
        variant: 'destructive',
      });
      return;
    }

    await updatePassword.mutateAsync(passwordData.newPassword);
    setPasswordData({ newPassword: '', confirmPassword: '' });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast({
        title: t("settings.success.photo"),
        description: t("settings.success.photoDesc"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: t("settings.tabs.profile"), icon: User, color: 'text-primary' },
    { id: 'company', label: t("settings.tabs.company"), icon: Building, color: 'text-indigo-500' },
    { id: 'security', label: t("settings.tabs.security"), icon: Shield, color: 'text-destructive' },
    { id: 'notifications', label: t("settings.tabs.notifications"), icon: Bell, color: 'text-warning' },
    { id: 'preferences', label: t("settings.tabs.preferences"), icon: Palette, color: 'text-info' },
    { id: 'session', label: t("settings.tabs.session"), icon: Database, color: 'text-success' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-6xl mx-auto space-y-4 md:space-y-6">
      {/* Page Header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">{t("settings.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("settings.subtitle")}
          </p>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0 shrink-0 border-b border-border/40 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 transition-all duration-300 font-semibold text-sm border-b-2 rounded-t-lg outline-none",
                isActive 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? tab.color : "text-muted-foreground/70")} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 overflow-y-auto bg-card rounded-2xl border border-border/50 shadow-sm p-6 relative">
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Avatar Section */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-lg bg-muted relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                  
                  {/* Hover overlay for uploading */}
                  <div 
                    className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    onClick={handleAvatarClick}
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{t("settings.profile.updatePhoto")}</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange} 
                />
              </div>
              
              {role && (
                <span className={cn(
                  'mt-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm',
                  role === 'admin' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                  role === 'gestionnaire' ? 'bg-warning/10 text-warning border border-warning/20' :
                  'bg-info/10 text-info border border-info/20'
                )}>
                  {role === 'admin' ? t("settings.profile.roles.admin") : role === 'gestionnaire' ? t("settings.profile.roles.manager") : t("settings.profile.roles.reader")}
                </span>
              )}
            </div>

            <Separator orientation="vertical" className="hidden md:block h-auto" />
            <Separator orientation="horizontal" className="md:hidden" />
            
            {/* Form Section */}
            <div className="flex-1 space-y-6 max-w-xl">
              <div>
                <h2 className="text-xl font-bold text-card-foreground">{t("settings.profile.title")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("settings.profile.desc")}</p>
              </div>
              
              <div className="grid gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">{t("settings.profile.fullName")}</Label>
                  <Input 
                    id="name" 
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">{t("settings.profile.email")}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="bg-muted h-11 rounded-lg"
                  />
                  <p className="text-xs text-muted-foreground">{t("settings.profile.emailHelp")}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving || updateProfile.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-8 rounded-lg shadow-sm"
                >
                  {(isSaving || updateProfile.isPending) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {t("settings.profile.save")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* COMPANY TAB */}
        {activeTab === 'company' && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{t("settings.company.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("settings.company.desc")}</p>
            </div>
            <Separator />
            
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="font-semibold">{t("settings.company.name")}</Label>
                <Input 
                  id="company-name" 
                  value={companyData.name}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-siret" className="font-semibold">{t("settings.company.siret")}</Label>
                <Input 
                  id="company-siret" 
                  value={companyData.siret}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, siret: e.target.value }))}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company-address" className="font-semibold">{t("settings.company.address")}</Label>
                <Input 
                  id="company-address" 
                  value={companyData.address}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, address: e.target.value }))}
                  className="h-11 rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-phone" className="font-semibold">{t("settings.company.phone")}</Label>
                <Input 
                  id="company-phone" 
                  value={companyData.phone}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, phone: e.target.value }))}
                  className="h-11 rounded-lg"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSaveCompany}
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-8 rounded-lg shadow-sm"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {t("settings.company.update")}
              </Button>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{t("settings.security.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("settings.security.desc")}</p>
            </div>
            <Separator />
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl">
              <div className="space-y-5 bg-muted/20 p-6 rounded-2xl border border-border/50 shadow-sm">
                <h3 className="font-bold flex items-center gap-2"><Shield className="h-5 w-5 text-destructive" /> {t("settings.security.changePassword")}</h3>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="font-semibold">{t("settings.security.newPassword")}</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="h-11 rounded-lg bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="font-semibold">{t("settings.security.confirmPassword")}</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="h-11 rounded-lg bg-background"
                  />
                </div>
                <Button 
                  variant="destructive" 
                  onClick={handleChangePassword}
                  disabled={updatePassword.isPending || !passwordData.newPassword}
                  className="mt-4 h-11 rounded-lg shadow-sm w-full sm:w-auto"
                >
                  {updatePassword.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("settings.security.update")}
                </Button>
              </div>
              
              <div className="space-y-4 p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col justify-center items-center text-center bg-muted/10">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg">{t("settings.security.twoFactor")}</h3>
                <p className="text-sm text-muted-foreground max-w-sm">{t("settings.security.twoFactorDesc")}</p>
                <Button variant="outline" disabled className="mt-4 rounded-full">{t("settings.security.comingSoon")}</Button>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{t("settings.notifications.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("settings.notifications.desc")}</p>
            </div>
            <Separator />
            
            <div className="grid gap-4 max-w-3xl">
              <div className="flex items-center justify-between p-5 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors shadow-sm">
                <div>
                  <p className="font-bold text-card-foreground">{t("settings.notifications.urgentAlerts")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("settings.notifications.urgentAlertsDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-5 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors shadow-sm">
                <div>
                  <p className="font-bold text-card-foreground">{t("settings.notifications.maintenanceReminders")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("settings.notifications.maintenanceRemindersDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-5 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors shadow-sm">
                <div>
                  <p className="font-bold text-card-foreground">{t("settings.notifications.newReservations")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("settings.notifications.newReservationsDesc")}</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-5 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors shadow-sm">
                <div>
                  <p className="font-bold text-card-foreground">{t("settings.notifications.weeklyReport")}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{t("settings.notifications.weeklyReportDesc")}</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{t("settings.preferences.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("settings.preferences.desc")}</p>
            </div>
            <Separator />
            
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
              <div className="space-y-2 p-4 rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                <Label className="text-sm font-bold block mb-2">{t('settings.preferences.language')}</Label>
                <Select value={language} onValueChange={(val) => setLanguage(val)}>
                  <SelectTrigger className="h-11 rounded-lg bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français (France)</SelectItem>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 p-4 rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                <Label className="text-sm font-bold block mb-2">{t('settings.preferences.dateFormat')}</Label>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger className="h-11 rounded-lg bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">JJ/MM/AAAA (31/12/2026)</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM/DD/YYYY (12/31/2026)</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (2026-12-31)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 p-4 rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                <Label className="text-sm font-bold block mb-2">{t('settings.preferences.distance')}</Label>
                <Select defaultValue="km">
                  <SelectTrigger className="h-11 rounded-lg bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">Kilomètres (km)</SelectItem>
                    <SelectItem value="mi">Miles (mi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 p-4 rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                <Label className="text-sm font-bold block mb-2">{t('settings.preferences.currency')}</Label>
                <Select value={currency} onValueChange={(val) => setCurrency(val as any)}>
                  <SelectTrigger className="h-11 rounded-lg bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fcfa">Franc CFA (FCFA)</SelectItem>
                    <SelectItem value="eur">Euro (€)</SelectItem>
                    <SelectItem value="usd">Dollar Américain ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* SESSION TAB */}
        {activeTab === 'session' && (
          <div className="animate-fade-in space-y-6 h-full flex flex-col">
            <div>
              <h2 className="text-xl font-bold text-card-foreground">{t("settings.session.title")}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t("settings.session.desc")}</p>
            </div>
            <Separator />
            
            <div className="flex-1 flex items-center justify-center py-10">
              <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-destructive/5 border border-destructive/20 text-center max-w-md shadow-lg">
                <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                  <LogOut className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="font-extrabold text-destructive text-2xl mb-2">{t("settings.session.logoutTitle")}</h3>
                <p className="text-muted-foreground mb-8">{t("settings.session.logoutDesc")}</p>
                <Button variant="destructive" onClick={signOut} className="w-full h-12 rounded-xl text-lg font-bold shadow-md hover:shadow-lg transition-all">
                  {t("settings.session.logout")}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;
