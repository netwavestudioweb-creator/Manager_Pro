import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fr, enUS, es } from 'date-fns/locale';

export const getDateLocale = () => {
  const lang = i18n.language || 'fr';
  if (lang.startsWith('en')) return enUS;
  if (lang.startsWith('es')) return es;
  return fr;
};

const resources = {
  fr: {
    translation: {
      auth: {
        titleLogin: "Connexion",
        titleRegister: "Créer un compte",
        fullName: "Nom complet",
        fullNamePlaceholder: "Jean Dupont",
        email: "Email",
        emailPlaceholder: "vous@exemple.com",
        password: "Mot de passe",
        passwordPlaceholder: "••••••••",
        loginButton: "Se connecter",
        registerButton: "Créer le compte",
        loading: "Chargement...",
        noAccount: "Pas encore de compte ? S'inscrire",
        hasAccount: "Déjà un compte ? Se connecter",
        footerText: "En vous connectant, vous acceptez nos conditions d'utilisation",
        errors: {
          loginFailed: "Erreur de connexion",
          registerFailed: "Erreur d'inscription",
          fullNameRequired: "Veuillez entrer votre nom complet",
          passwordsDontMatch: "Les mots de passe ne correspondent pas",
          unexpected: "Une erreur inattendue s'est produite"
        },
        success: {
          login: "Connexion réussie",
          welcome: "Bienvenue !",
          accountCreated: "Compte créé !",
          canLoginNow: "Vous pouvez maintenant vous connecter"
        }
      },
      sidebar: {
        dashboard: "Tableau de bord",
        vehicles: "Véhicules",
        maintenance: "Entretiens",
        breakdowns: "Pannes",
        assignments: "Réservations",
        fuel: "Carburant",
        drivers: "Chauffeurs",
        alerts: "Alertes",
        history: "Historique",
        reports: "Rapports",
        settings: "Paramètres"
      },
      header: {
        search: "Rechercher...",
        notifications: "Notifications",
        markAllRead: "Tout marquer comme lu",
        noNotifications: "Aucune notification",
        viewAllNotifications: "Voir toutes les notifications",
        myAccount: "Mon Compte",
        profile: "Profil",
        switchAccount: "Changer de compte",
        mockSwitch: "Sélectionnez un autre compte (Mock)",
        logout: "Se déconnecter",
        roles: {
          admin: "Administrateur",
          manager: "Gestionnaire",
          reader: "Lecteur",
          user: "Utilisateur"
        }
      },
      dashboard: {
        title: "Tableau de bord",
        subtitle: "Vue d'ensemble de votre flotte",
        stats: {
          totalVehicles: "Total Véhicules",
          inMaintenance: "En Entretien",
          breakdowns: "Pannes",
          availability: "Disponibilité",
          activeReservations: "Réservations Actives",
          monthlyFuel: "Carburant (Mois)",
          activeDrivers: "Chauffeurs Actifs",
          monthlyCosts: "Coûts (Mois)"
        },
        recentAlerts: {
          title: "Dernières alertes",
          viewAll: "Voir tout",
          noData: "Aucune alerte récente"
        },
        recentVehicles: {
          title: "Véhicules récents",
          viewAll: "Voir tout",
          noData: "Aucun véhicule",
          columns: {
            vehicle: "Véhicule",
            registration: "Immatriculation",
            status: "Statut",
            fuel: "Carburant",
            mileage: "Kilométrage"
          }
        },
        charts: {
          maintenanceCosts: "Coûts d'entretien",
          monthlyEvolution: "Évolution sur les 12 derniers mois",
          thisYear: "Cette année",
          cost: "Coût",
          month: "Mois",
          fuelConsumption: "Consommation de carburant",
          last6Months: "6 derniers mois",
          diesel: "Diesel",
          gasoline: "Essence",
          fleetStatus: "État de la flotte",
          noVehicles: "Aucun véhicule enregistré",
          vehicles: "véhicules"
        }
      },
      status: {
        urgent: "Urgent",
        warning: "Attention",
        info: "Info",
        available: "Disponible",
        onMission: "En mission",
        inMaintenance: "En entretien",
        brokenDown: "En panne",
        scheduled: "Prévu",
        completed: "Terminé",
        cancelled: "Annulé"
      },
      vehicles: {
        title: "Véhicules",
        subtitle: "Gérez votre flotte de véhicules",
        add: "Ajouter un véhicule",
        addTitle: "Ajouter un nouveau véhicule",
        addDesc: "Remplissez les détails du véhicule ci-dessous.",
        search: "Rechercher un véhicule...",
        filterStatus: "Filtrer par statut",
        allStatuses: "Tous les statuts",
        noData: "Aucun véhicule trouvé.",
        edit: "Modifier le véhicule",
        editTitle: "Modifier le véhicule",
        editDesc: "Modifiez les informations de ce véhicule.",
        deleteTitle: "Supprimer le véhicule",
        deleteDesc: "Êtes-vous sûr de vouloir supprimer le véhicule {{brand}} {{model}} ? Cette action est irréversible.",
        delete: "Supprimer",
        plate: "Immatriculation",
        fuel: "Carburant",
        mileage: "Kilométrage",
        category: "Catégorie",
        errorLoading: "Erreur lors du chargement des véhicules",
        form: {
          brand: "Marque",
          brandPlaceholder: "Ex: Renault",
          model: "Modèle",
          modelPlaceholder: "Ex: Kangoo",
          year: "Année",
          yearPlaceholder: "Ex: 2022",
          registration: "Immatriculation",
          registrationPlaceholder: "Ex: AA-123-BB",
          fuel: "Carburant",
          selectPlaceholder: "Sélectionner...",
          category: "Catégorie",
          mileage: "Kilométrage",
          photosTitle: "Photos du véhicule",
          photo1: "Photo principale",
          photo2: "Photo 2 (Optionnel)",
          photo3: "Photo 3 (Optionnel)"
        }
      },
      reservations: {
        title: "Réservations",
        subtitle: "Gérez les assignations et réservations",
        add: "Nouvelle réservation",
        addTitle: "Ajouter une réservation",
        addDesc: "Détails de la réservation",
        search: "Rechercher...",
        filterStatus: "Filtrer par statut",
        allStatuses: "Tous les statuts",
        noData: "Aucune réservation trouvée.",
        stats: {
          total: "Total Réservations",
          pending: "En attente",
          confirmed: "Confirmées",
          availableVehicles: "Véhicules disponibles"
        },
        list: {
          unknownVehicle: "Véhicule inconnu",
          defaultPurpose: "Mission standard",
          start: "Début",
          end: "Fin",
          confirm: "Confirmer",
          reject: "Rejeter",
          complete: "Terminer"
        },
        form: {
          vehicle: "Véhicule",
          vehiclePlaceholder: "Sélectionner...",
          driver: "Chauffeur",
          driverPlaceholder: "Sélectionner...",
          startDate: "Date de début",
          endDate: "Date de fin",
          purpose: "Motif",
          purposePlaceholder: "Ex: Déplacement client",
          destination: "Destination",
          destinationPlaceholder: "Ex: Paris",
          notes: "Notes",
          notesPlaceholder: "Informations supplémentaires..."
        }
      },
      reports: {
        title: "Rapports",
        subtitle: "Analysez les performances de votre flotte",
        period: "Période",
        category: "Catégorie",
        generatePdf: "Générer PDF",
        generateExcel: "Générer Excel",
        periods: {
          week: "Cette semaine",
          month: "Ce mois",
          quarter: "Ce trimestre",
          year: "Cette année",
          all: "Tout"
        },
        categories: {
          all: "Toutes",
          vehicles: "Véhicules",
          maintenance: "Entretien",
          fuel: "Carburant",
          financial: "Finances",
          drivers: "Chauffeurs",
          breakdowns: "Pannes",
          reservations: "Réservations"
        },
        stats: {
          title: "Statistiques : {{period}}",
          activeVehicles: "Véhicules actifs",
          maintenancesDone: "Entretiens",
          fuelConsumed: "Carburant (L)",
          totalCosts: "Coûts totaux"
        },
        downloading: {
          title: "Génération...",
          subtitle: "Veuillez patienter.",
          successTitle: "Succès !",
          successDesc: "Le fichier a été téléchargé.",
          errorTitle: "Erreur",
          errorDesc: "Échec de la génération.",
          notAvailable: "Non disponible."
        },
        items: {
          fleetStatus: { title: "État du parc", desc: "Vue globale de l'état des véhicules." },
          vehiclesList: { title: "Liste des véhicules", desc: "Données brutes." },
          maintenanceReport: { title: "Rapport d'entretien", desc: "Résumé des interventions." },
          maintenanceData: { title: "Données d'entretien", desc: "Historique complet." },
          fuelConsumption: { title: "Consommation carburant", desc: "Analyse des pleins." },
          fuelLogs: { title: "Registres carburant", desc: "Historique brut." },
          financialReport: { title: "Rapport financier", desc: "Résumé des dépenses." },
          financialData: { title: "Données financières", desc: "Détail des dépenses." },
          driversList: { title: "Liste chauffeurs", desc: "Informations conducteurs." },
          driversData: { title: "Données chauffeurs", desc: "Export complet." },
          breakdownsReport: { title: "Rapport des pannes", desc: "Analyse des pannes." },
          breakdownsData: { title: "Données des pannes", desc: "Historique des pannes." },
          reservationsReport: { title: "Rapport réservations", desc: "Analyse utilisation." },
          reservationsData: { title: "Données réservations", desc: "Historique des affectations." }
        }
      },
      maintenance: {
        title: "Entretiens",
        subtitle: "Suivez l'entretien de vos véhicules",
        add: "Ajouter un entretien",
        addTitle: "Ajouter un entretien",
        addDesc: "Planifiez ou enregistrez un entretien pour un véhicule.",
        search: "Rechercher un entretien...",
        filterStatus: "Filtrer par statut",
        allStatuses: "Tous les statuts",
        noData: "Aucun entretien enregistré.",
        errorLoading: "Erreur lors du chargement des entretiens",
        stats: {
          total: "Total Entretiens",
          scheduled: "Entretiens Prévus",
          inProgress: "En Cours",
          totalCost: "Coût Total"
        },
        list: {
          noDescription: "Aucune description fournie.",
          unknownVehicle: "Véhicule inconnu",
          date: "Date prévue",
          mileage: "Kilométrage",
          cost: "Coût",
          next: "Prochain à"
        },
        form: {
          vehicle: "Véhicule",
          vehiclePlaceholder: "Sélectionner un véhicule",
          type: "Type d'intervention",
          typePlaceholder: "Ex: Vidange",
          types: {
            oilChange: "Vidange",
            brakes: "Freins",
            tires: "Pneus",
            fullService: "Révision complète",
            ac: "Climatisation",
            battery: "Batterie",
            belt: "Courroie",
            other: "Autre"
          },
          date: "Date (Optionnelle)",
          description: "Description",
          descriptionPlaceholder: "Détails de l'intervention...",
          cost: "Coût (Optionnel)",
          mileage: "Kilométrage actuel (Optionnel)",
          nextMileage: "Prochain entretien à (km, Optionnel)"
        }
      },
      history: {
        title: "Historique",
        subtitle: "Consultez l'historique complet des actions",
        search: "Rechercher...",
        filterType: "Filtrer par type",
        allTypes: "Tous les types",
        noDataTitle: "Aucun historique",
        noDataFilter: "Aucune action ne correspond",
        noDataDesc: "L'historique des actions est vide",
        types: {
          maintenance: "Entretien",
          breakdown: "Panne",
          reservation: "Réservation",
          fuel: "Carburant"
        }
      },
      fuel: {
        title: "Carburant",
        subtitle: "Suivez la consommation de carburant",
        add: "Ajouter un plein",
        addTitle: "Ajouter un plein",
        addDesc: "Remplissez les détails du plein de carburant.",
        search: "Rechercher un plein...",
        noData: "Aucun plein enregistré.",
        chartTitle: "Consommation de carburant",
        chartTooltip: "Carburant",
        errorLoading: "Erreur lors du chargement des relevés",
        stats: {
          totalConsumed: "Total Consommé",
          totalCost: "Coût Total",
          recordedLogs: "Pleins Enregistrés",
          avgCost: "Coût Moyen / L"
        },
        list: {
          unknownVehicle: "Véhicule inconnu",
          liters: "Litres",
          cost: "Coût",
        },
        form: {
          vehicle: "Véhicule",
          vehiclePlaceholder: "Sélectionner un véhicule",
          driver: "Conducteur",
          driverPlaceholder: "Sélectionner un conducteur (Optionnel)",
          liters: "Volume (Litres)",
          cost: "Coût",
          mileage: "Kilométrage au moment du plein",
          type: "Type de carburant",
          station: "Station service (Optionnel)",
          stationPlaceholder: "Ex: Total, Shell...",
          types: {
            diesel: "Diesel",
            gasoline: "Essence",
            hybrid: "Hybride"
          }
        }
      },
      drivers: {
        title: "Chauffeurs",
        subtitle: "Gérez votre équipe de chauffeurs",
        add: "Ajouter",
        addTitle: "Ajouter un chauffeur",
        addDesc: "Détails du chauffeur",
        editTitle: "Modifier",
        editDesc: "Modifiez les informations",
        search: "Rechercher...",
        noData: "Aucun chauffeur",
        stats: {
          total: "Total",
          active: "Actifs",
          expiring: "Permis expirant",
        },
        list: {
          active: "Actif",
          inactive: "Inactif",
          licenseNumber: "N° Permis",
          expiry: "Expiration",
        },
        form: {
          fullName: "Nom complet",
          fullNamePlaceholder: "Ex: Jean Dupont",
          email: "Email",
          emailPlaceholder: "jean@example.com",
          phone: "Téléphone",
          phonePlaceholder: "Ex: 06 12 34 56 78",
          licenseNumber: "N° de permis",
          licenseNumberPlaceholder: "Ex: 123456789",
          licenseExpiry: "Date d'expiration",
        }
      },
      alerts: {
        title: "Alertes",
        subtitle: "Notifications et alertes système",
        markAllRead: "Tout marquer comme lu",
        actionRequired: "Action requise",
        noDataTitle: "Aucune alerte",
        noDataDesc: "Vous êtes à jour ! Aucune notification.",
        timeAgo: {
          minutes_one: "Il y a {{count}} minute",
          minutes_other: "Il y a {{count}} minutes",
          hours_one: "Il y a {{count}} heure",
          hours_other: "Il y a {{count}} heures"
        },
        stats: {
          total: "Total",
          unread: "Non lues",
          urgent: "Urgentes"
        },
        filters: {
          priority: "Priorité",
          allPriorities: "Toutes les priorités",
          type: "Type",
          allTypes: "Tous les types"
        },
        priorities: {
          urgent: "Urgent",
          warning: "Avertissement",
          info: "Information"
        },
        types: {
          breakdown: "Panne",
          maintenance: "Entretien",
          reservation: "Réservation",
          insurance: "Assurance",
          inspection: "Contrôle technique"
        }
      },
      breakdowns: {
        title: "Gestion des pannes",
        subtitle: "Déclarer et suivre les pannes des véhicules",
        searchPlaceholder: "Rechercher une panne...",
        allStatus: "Tous les statuts",
        filterStatus: "Filtrer par statut",
        cancel: "Annuler",
        errorLoading: "Erreur lors du chargement des pannes",
        stats: {
          open: "Pannes ouvertes",
          critical: "Critiques",
          resolved: "Résolues"
        },
        criticalAlert: {
          text: "{{count}} panne(s) critique(s) en cours",
          action: "Action immédiate requise"
        },
        status: {
          open: "Ouverte",
          in_progress: "En cours",
          resolved: "Résolu"
        },
        form: {
          declareTitle: "Signaler une panne",
          declareSubtitle: "Enregistrez une nouvelle panne sur un véhicule",
          vehicle: "Véhicule",
          selectVehicle: "Sélectionner un véhicule",
          description: "Description de la panne",
          descriptionPlaceholder: "Détaillez le problème rencontré...",
          severity: "Sévérité",
          severityLow: "Faible",
          severityMedium: "Moyenne",
          severityHigh: "Haute",
          severityCritical: "Critique",
          repairCost: "Coût de réparation",
          resolutionNotes: "Notes de résolution",
          resolutionNotesPlaceholder: "Détaillez les réparations effectuées...",
          resolveTitle: "Résoudre la panne",
          resolveSubtitle: "Entrez les détails de la résolution",
          declareAction: "Signaler la panne",
          resolveAction: "Marquer comme résolu"
        }
      },
      settings: {
        title: "Paramètres",
        subtitle: "Gérez vos préférences et paramètres administratifs",
        tabs: {
          profile: "Profil",
          company: "Entreprise",
          security: "Sécurité",
          notifications: "Notifications",
          preferences: "Préférences",
          session: "Session"
        },
        profile: {
          title: "Informations Personnelles",
          desc: "Mettez à jour vos informations de base.",
          fullName: "Nom complet",
          email: "Adresse Email",
          emailHelp: "L'adresse email est liée à votre compte d'authentification et ne peut être modifiée ici.",
          save: "Enregistrer les modifications",
          updatePhoto: "Modifier la photo",
          defaultUser: "Utilisateur",
          roles: {
            admin: "Administrateur",
            manager: "Gestionnaire",
            reader: "Lecteur"
          }
        },
        company: {
          title: "Configuration de l'Entreprise",
          desc: "Ces informations apparaîtront sur vos rapports et documents PDF.",
          name: "Nom de l'entreprise",
          siret: "Numéro de SIRET / Registre",
          address: "Adresse complète",
          phone: "Téléphone contact",
          update: "Mettre à jour l'entreprise"
        },
        security: {
          title: "Sécurité du Compte",
          desc: "Gérez votre mot de passe et l'accès à votre compte.",
          changePassword: "Changer le mot de passe",
          newPassword: "Nouveau mot de passe",
          confirmPassword: "Confirmer le mot de passe",
          update: "Mettre à jour le mot de passe",
          twoFactor: "Authentification à deux facteurs (2FA)",
          twoFactorDesc: "Renforcez la sécurité de votre compte administrateur.",
          comingSoon: "Bientôt dispo",
          passwordMismatch: "Les mots de passe ne correspondent pas",
          passwordLength: "Le mot de passe doit contenir au moins 6 caractères"
        },
        notifications: {
          title: "Préférences de Notification",
          desc: "Choisissez comment et quand vous souhaitez être alerté.",
          urgentAlerts: "Alertes pannes urgentes",
          urgentAlertsDesc: "Notification immédiate dans l'application et par email.",
          maintenanceReminders: "Rappels d'entretien",
          maintenanceRemindersDesc: "Être alerté 7 jours avant l'échéance d'un entretien.",
          newReservations: "Nouvelles réservations",
          newReservationsDesc: "Être notifié lorsqu'un utilisateur demande un véhicule.",
          weeklyReport: "Rapport hebdomadaire",
          weeklyReportDesc: "Recevoir un résumé des dépenses et activités tous les lundis."
        },
        preferences: {
          title: "Préférences Système",
          desc: "Personnalisez l'affichage de l'application selon vos besoins.",
          language: "Langue de l'interface",
          dateFormat: "Format de date",
          distance: "Unité de distance",
          currency: "Devise principale"
        },
        session: {
          title: "Gestion de Session",
          desc: "Gérez votre connexion actuelle.",
          logout: "Se déconnecter",
          logoutTitle: "Déconnexion",
          logoutDesc: "Vous serez déconnecté de votre session actuelle sur cet appareil."
        },
        success: {
          profile: "Profil mis à jour",
          profileDesc: "Vos informations ont été enregistrées avec succès.",
          company: "Entreprise mise à jour",
          companyDesc: "Les informations de l'entreprise ont été enregistrées.",
          photo: "Photo mise à jour",
          photoDesc: "Votre photo de profil a été modifiée avec succès."
        }
      },
      common: {
        save: "Enregistrer",
        cancel: "Annuler",
        edit: "Modifier",
        delete: "Supprimer"
      }
    }
  },
  en: {
    translation: {
      auth: {
        titleLogin: "Login",
        titleRegister: "Create Account",
        fullName: "Full Name",
        fullNamePlaceholder: "John Doe",
        email: "Email",
        emailPlaceholder: "you@example.com",
        password: "Password",
        passwordPlaceholder: "••••••••",
        loginButton: "Sign In",
        registerButton: "Sign Up",
        loading: "Loading...",
        noAccount: "Don't have an account? Sign up",
        hasAccount: "Already have an account? Sign in",
        footerText: "By signing in, you agree to our terms of service",
        errors: {
          loginFailed: "Login failed",
          registerFailed: "Registration failed",
          fullNameRequired: "Please enter your full name",
          passwordsDontMatch: "Passwords do not match",
          unexpected: "An unexpected error occurred"
        },
        success: {
          login: "Login successful",
          welcome: "Welcome!",
          accountCreated: "Account created!",
          canLoginNow: "You can now log in"
        }
      },
      sidebar: {
        dashboard: "Dashboard",
        vehicles: "Vehicles",
        maintenance: "Maintenance",
        breakdowns: "Breakdowns",
        assignments: "Assignments",
        fuel: "Fuel",
        drivers: "Drivers",
        alerts: "Alerts",
        history: "History",
        reports: "Reports",
        settings: "Settings"
      },
      header: {
        search: "Search...",
        notifications: "Notifications",
        markAllRead: "Mark all as read",
        noNotifications: "No notifications",
        viewAllNotifications: "View all notifications",
        myAccount: "My Account",
        profile: "Profile",
        switchAccount: "Switch account",
        mockSwitch: "Select another account (Mock)",
        logout: "Logout",
        roles: {
          admin: "Administrator",
          manager: "Manager",
          reader: "Reader",
          user: "User"
        }
      },
      dashboard: {
        title: "Dashboard",
        subtitle: "Overview of your fleet",
        stats: {
          totalVehicles: "Total Vehicles",
          inMaintenance: "In Maintenance",
          breakdowns: "Breakdowns",
          availability: "Availability",
          activeReservations: "Active Reservations",
          monthlyFuel: "Fuel (Month)",
          activeDrivers: "Active Drivers",
          monthlyCosts: "Costs (Month)"
        },
        recentAlerts: {
          title: "Recent alerts",
          viewAll: "View all",
          noData: "No recent alerts"
        },
        recentVehicles: {
          title: "Recent vehicles",
          viewAll: "View all",
          noData: "No vehicles",
          columns: {
            vehicle: "Vehicle",
            registration: "Registration",
            status: "Status",
            fuel: "Fuel",
            mileage: "Mileage"
          }
        },
        charts: {
          maintenanceCosts: "Maintenance Costs",
          monthlyEvolution: "Evolution over the last 12 months",
          thisYear: "This year",
          cost: "Cost",
          month: "Month",
          fuelConsumption: "Fuel Consumption",
          last6Months: "Last 6 months",
          diesel: "Diesel",
          gasoline: "Gasoline",
          fleetStatus: "Fleet Status",
          noVehicles: "No vehicles registered",
          vehicles: "vehicles"
        }
      },
      status: {
        urgent: "Urgent",
        warning: "Warning",
        info: "Info",
        available: "Available",
        onMission: "On mission",
        inMaintenance: "In maintenance",
        brokenDown: "Broken down",
        scheduled: "Scheduled",
        completed: "Completed",
        cancelled: "Cancelled"
      },
      vehicles: {
        title: "Vehicles",
        subtitle: "Manage your vehicle fleet",
        add: "Add a vehicle",
        addTitle: "Add new vehicle",
        addDesc: "Fill in the vehicle details below.",
        search: "Search a vehicle...",
        filterStatus: "Filter by status",
        allStatuses: "All statuses",
        noData: "No vehicles found.",
        edit: "Edit vehicle",
        editTitle: "Edit vehicle",
        editDesc: "Modify the information of this vehicle.",
        deleteTitle: "Delete vehicle",
        deleteDesc: "Are you sure you want to delete the vehicle {{brand}} {{model}}? This action cannot be undone.",
        delete: "Delete",
        plate: "Registration",
        fuel: "Fuel Type",
        mileage: "Mileage",
        category: "Category",
        errorLoading: "Error loading vehicles",
        form: {
          brand: "Brand",
          brandPlaceholder: "Ex: Toyota",
          model: "Model",
          modelPlaceholder: "Ex: Corolla",
          year: "Year",
          yearPlaceholder: "Ex: 2022",
          registration: "Registration",
          registrationPlaceholder: "Ex: XYZ-123",
          fuel: "Fuel Type",
          selectPlaceholder: "Select...",
          category: "Category",
          mileage: "Mileage",
          photosTitle: "Vehicle Photos",
          photo1: "Main Photo",
          photo2: "Photo 2 (Optional)",
          photo3: "Photo 3 (Optional)"
        }
      },
      reservations: {
        title: "Assignments",
        subtitle: "Manage assignments and reservations",
        add: "New Reservation",
        addTitle: "Add Reservation",
        addDesc: "Reservation details",
        search: "Search...",
        filterStatus: "Filter by status",
        allStatuses: "All statuses",
        noData: "No reservations found.",
        stats: {
          total: "Total Reservations",
          pending: "Pending",
          confirmed: "Confirmed",
          availableVehicles: "Available Vehicles"
        },
        list: {
          unknownVehicle: "Unknown vehicle",
          defaultPurpose: "Standard mission",
          start: "Start",
          end: "End",
          confirm: "Confirm",
          reject: "Reject",
          complete: "Complete"
        },
        form: {
          vehicle: "Vehicle",
          vehiclePlaceholder: "Select...",
          driver: "Driver",
          driverPlaceholder: "Select...",
          startDate: "Start Date",
          endDate: "End Date",
          purpose: "Purpose",
          purposePlaceholder: "Ex: Client meeting",
          destination: "Destination",
          destinationPlaceholder: "Ex: New York",
          notes: "Notes",
          notesPlaceholder: "Additional info..."
        }
      },
      reports: {
        title: "Reports",
        subtitle: "Analyze your fleet performance",
        period: "Period",
        category: "Category",
        generatePdf: "Generate PDF",
        generateExcel: "Generate Excel",
        periods: {
          week: "This week",
          month: "This month",
          quarter: "This quarter",
          year: "This year",
          all: "All"
        },
        categories: {
          all: "All",
          vehicles: "Vehicles",
          maintenance: "Maintenance",
          fuel: "Fuel",
          financial: "Financial",
          drivers: "Drivers",
          breakdowns: "Breakdowns",
          reservations: "Reservations"
        },
        stats: {
          title: "Stats: {{period}}",
          activeVehicles: "Active vehicles",
          maintenancesDone: "Maintenances",
          fuelConsumed: "Fuel (L)",
          totalCosts: "Total costs"
        },
        downloading: {
          title: "Generating...",
          subtitle: "Please wait.",
          successTitle: "Success!",
          successDesc: "File downloaded successfully.",
          errorTitle: "Error",
          errorDesc: "Generation failed.",
          notAvailable: "Not available."
        },
        items: {
          fleetStatus: { title: "État du parc", desc: "Vue globale de l'état des véhicules." },
          vehiclesList: { title: "Liste des véhicules", desc: "Données brutes." },
          maintenanceReport: { title: "Rapport d'entretien", desc: "Résumé des interventions." },
          maintenanceData: { title: "Données d'entretien", desc: "Historique complet." },
          fuelConsumption: { title: "Consommation carburant", desc: "Analyse des pleins." },
          fuelLogs: { title: "Registres carburant", desc: "Historique brut." },
          financialReport: { title: "Rapport financier", desc: "Résumé des dépenses." },
          financialData: { title: "Données financières", desc: "Détail des dépenses." },
          driversList: { title: "Liste chauffeurs", desc: "Informations conducteurs." },
          driversData: { title: "Données chauffeurs", desc: "Export complet." },
          breakdownsReport: { title: "Rapport des pannes", desc: "Analyse des pannes." },
          breakdownsData: { title: "Données des pannes", desc: "Historique des pannes." },
          reservationsReport: { title: "Rapport réservations", desc: "Analyse utilisation." },
          reservationsData: { title: "Données réservations", desc: "Historique des affectations." }
        }
      },
      maintenance: {
        title: "Maintenance",
        subtitle: "Track vehicle maintenance",
        add: "Add maintenance",
        addTitle: "Add maintenance",
        addDesc: "Schedule or record maintenance for a vehicle.",
        search: "Search maintenance...",
        filterStatus: "Filter by status",
        allStatuses: "All statuses",
        noData: "No maintenance recorded.",
        errorLoading: "Error loading maintenance records",
        stats: {
          total: "Total Maintenance",
          scheduled: "Scheduled Maintenance",
          inProgress: "In Progress",
          totalCost: "Total Cost"
        },
        list: {
          noDescription: "No description provided.",
          unknownVehicle: "Unknown vehicle",
          date: "Scheduled date",
          mileage: "Mileage",
          cost: "Cost",
          next: "Next at"
        },
        form: {
          vehicle: "Vehicle",
          vehiclePlaceholder: "Select a vehicle",
          type: "Service type",
          typePlaceholder: "Ex: Oil change",
          types: {
            oilChange: "Oil change",
            brakes: "Brakes",
            tires: "Tires",
            fullService: "Full service",
            ac: "A/C",
            battery: "Battery",
            belt: "Belt",
            other: "Other"
          },
          date: "Date (Optional)",
          description: "Description",
          descriptionPlaceholder: "Service details...",
          cost: "Cost (Optional)",
          mileage: "Current mileage (Optional)",
          nextMileage: "Next service at (km, Optional)"
        }
      },
      history: {
        title: "History",
        subtitle: "View complete action history",
        search: "Search...",
        filterType: "Filter by type",
        allTypes: "All types",
        noDataTitle: "No history",
        noDataFilter: "No actions match your criteria",
        noDataDesc: "Action history is empty",
        types: {
          maintenance: "Maintenance",
          breakdown: "Breakdown",
          reservation: "Reservation",
          fuel: "Fuel"
        }
      },
      fuel: {
        title: "Fuel",
        subtitle: "Track fuel consumption",
        add: "Add fuel log",
        addTitle: "Add fuel log",
        addDesc: "Fill in the fuel log details.",
        search: "Search fuel logs...",
        noData: "No fuel logs recorded.",
        chartTitle: "Fuel Consumption",
        chartTooltip: "Fuel",
        errorLoading: "Error loading fuel logs",
        stats: {
          totalConsumed: "Total Consumed",
          totalCost: "Total Cost",
          recordedLogs: "Recorded Logs",
          avgCost: "Avg Cost / L"
        },
        list: {
          unknownVehicle: "Unknown vehicle",
          liters: "Liters",
          cost: "Cost",
        },
        form: {
          vehicle: "Vehicle",
          vehiclePlaceholder: "Select a vehicle",
          driver: "Driver",
          driverPlaceholder: "Select a driver (Optional)",
          liters: "Volume (Liters)",
          cost: "Cost",
          mileage: "Mileage at fill-up",
          type: "Fuel type",
          station: "Gas station (Optional)",
          stationPlaceholder: "Ex: Shell, BP...",
          types: {
            diesel: "Diesel",
            gasoline: "Gasoline",
            hybrid: "Hybrid"
          }
        }
      },
      drivers: {
        title: "Drivers",
        subtitle: "Manage your driver team",
        add: "Add",
        addTitle: "Add Driver",
        addDesc: "Driver details",
        editTitle: "Edit",
        editDesc: "Modify information",
        search: "Search...",
        noData: "No drivers",
        stats: {
          total: "Total",
          active: "Active",
          expiring: "Expiring license",
        },
        list: {
          active: "Active",
          inactive: "Inactive",
          licenseNumber: "License #",
          expiry: "Expiry",
        },
        form: {
          fullName: "Full Name",
          fullNamePlaceholder: "Ex: John Doe",
          email: "Email",
          emailPlaceholder: "john@example.com",
          phone: "Phone",
          phonePlaceholder: "Ex: +1 234 567 890",
          licenseNumber: "License Number",
          licenseNumberPlaceholder: "Ex: 123456789",
          licenseExpiry: "License Expiry Date",
        }
      },
      alerts: {
        title: "Alerts",
        subtitle: "System notifications and alerts",
        markAllRead: "Mark all as read",
        actionRequired: "Action required",
        noDataTitle: "No alerts",
        noDataDesc: "You are up to date! No new notifications.",
        timeAgo: {
          minutes_one: "{{count}} minute ago",
          minutes_other: "{{count}} minutes ago",
          hours_one: "{{count}} hour ago",
          hours_other: "{{count}} hours ago"
        },
        stats: {
          total: "Total",
          unread: "Unread",
          urgent: "Urgent"
        },
        filters: {
          priority: "Priority",
          allPriorities: "All priorities",
          type: "Type",
          allTypes: "All types"
        },
        priorities: {
          urgent: "Urgent",
          warning: "Warning",
          info: "Info"
        },
        types: {
          breakdown: "Breakdown",
          maintenance: "Maintenance",
          reservation: "Reservation",
          insurance: "Insurance",
          inspection: "Inspection"
        }
      },
      breakdowns: {
        title: "Breakdowns Management",
        subtitle: "Report and track vehicle breakdowns",
        searchPlaceholder: "Search for a breakdown...",
        allStatus: "All Statuses",
        filterStatus: "Filter by status",
        cancel: "Cancel",
        errorLoading: "Error loading breakdowns",
        stats: {
          open: "Open breakdowns",
          critical: "Critical",
          resolved: "Resolved"
        },
        criticalAlert: {
          text: "{{count}} critical breakdown(s) ongoing",
          action: "Immediate action required"
        },
        status: {
          open: "Open",
          in_progress: "In Progress",
          resolved: "Resolved"
        },
        form: {
          declareTitle: "Report a breakdown",
          declareSubtitle: "Register a new breakdown on a vehicle",
          vehicle: "Vehicle",
          selectVehicle: "Select a vehicle",
          description: "Breakdown Description",
          descriptionPlaceholder: "Detail the problem encountered...",
          severity: "Severity",
          severityLow: "Low",
          severityMedium: "Medium",
          severityHigh: "High",
          severityCritical: "Critical",
          repairCost: "Repair Cost",
          resolutionNotes: "Resolution Notes",
          resolutionNotesPlaceholder: "Detail the repairs made...",
          resolveTitle: "Resolve Breakdown",
          resolveSubtitle: "Enter resolution details",
          declareAction: "Report Breakdown",
          resolveAction: "Mark as Resolved"
        }
      },
      settings: {
        title: "Settings",
        subtitle: "Manage your preferences and administrative settings",
        tabs: {
          profile: "Profile",
          company: "Company",
          security: "Security",
          notifications: "Notifications",
          preferences: "Preferences",
          session: "Session"
        },
        profile: {
          title: "Personal Information",
          desc: "Update your basic information.",
          fullName: "Full Name",
          email: "Email Address",
          emailHelp: "The email address is linked to your authentication account and cannot be modified here.",
          save: "Save changes",
          updatePhoto: "Update photo",
          defaultUser: "User",
          roles: {
            admin: "Administrator",
            manager: "Manager",
            reader: "Reader"
          }
        },
        company: {
          title: "Company Configuration",
          desc: "This information will appear on your reports and PDF documents.",
          name: "Company Name",
          siret: "SIRET / Registry Number",
          address: "Full Address",
          phone: "Contact Phone",
          update: "Update company"
        },
        security: {
          title: "Account Security",
          desc: "Manage your password and access to your account.",
          changePassword: "Change Password",
          newPassword: "New Password",
          confirmPassword: "Confirm Password",
          update: "Update Password",
          twoFactor: "Two-Factor Authentication (2FA)",
          twoFactorDesc: "Strengthen the security of your administrator account.",
          comingSoon: "Coming soon",
          passwordMismatch: "Passwords do not match",
          passwordLength: "Password must contain at least 6 characters"
        },
        notifications: {
          title: "Notification Preferences",
          desc: "Choose how and when you want to be alerted.",
          urgentAlerts: "Urgent breakdown alerts",
          urgentAlertsDesc: "Immediate notification in the app and by email.",
          maintenanceReminders: "Maintenance reminders",
          maintenanceRemindersDesc: "Be alerted 7 days before a maintenance is due.",
          newReservations: "New reservations",
          newReservationsDesc: "Be notified when a user requests a vehicle.",
          weeklyReport: "Weekly report",
          weeklyReportDesc: "Receive a summary of expenses and activities every Monday."
        },
        preferences: {
          title: "System Preferences",
          desc: "Customize the application display to your needs.",
          language: "Interface Language",
          dateFormat: "Date Format",
          distance: "Distance Unit",
          currency: "Primary Currency"
        },
        session: {
          title: "Session Management",
          desc: "Manage your current connection.",
          logout: "Logout",
          logoutTitle: "Logout",
          logoutDesc: "You will be logged out of your current session on this device."
        },
        success: {
          profile: "Profile updated",
          profileDesc: "Your information has been successfully saved.",
          company: "Company updated",
          companyDesc: "Company information has been saved.",
          photo: "Photo updated",
          photoDesc: "Your profile photo was successfully updated."
        }
      },
      common: {
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete"
      }
    }
  },
  es: {
    translation: {
      auth: {
        titleLogin: "Iniciar sesión",
        titleRegister: "Crear una cuenta",
        fullName: "Nombre completo",
        fullNamePlaceholder: "Juan Pérez",
        email: "Correo",
        emailPlaceholder: "tu@ejemplo.com",
        password: "Contraseña",
        passwordPlaceholder: "••••••••",
        loginButton: "Ingresar",
        registerButton: "Crear cuenta",
        loading: "Cargando...",
        noAccount: "¿No tienes una cuenta? Regístrate",
        hasAccount: "¿Ya tienes cuenta? Inicia sesión",
        footerText: "Al iniciar sesión, aceptas nuestros términos de servicio",
        errors: {
          loginFailed: "Error al iniciar sesión",
          registerFailed: "Error al registrarse",
          fullNameRequired: "Por favor, ingresa tu nombre completo",
          passwordsDontMatch: "Las contraseñas no coinciden",
          unexpected: "Ocurrió un error inesperado"
        },
        success: {
          login: "Inicio de sesión exitoso",
          welcome: "¡Bienvenido!",
          accountCreated: "¡Cuenta creada!",
          canLoginNow: "Ahora puedes iniciar sesión"
        }
      },
      sidebar: {
        dashboard: "Tablero",
        vehicles: "Vehículos",
        maintenance: "Mantenimiento",
        breakdowns: "Averías",
        assignments: "Asignaciones",
        fuel: "Combustible",
        drivers: "Conductores",
        alerts: "Alertas",
        history: "Historial",
        reports: "Informes",
        settings: "Ajustes"
      },
      header: {
        search: "Buscar...",
        notifications: "Notificaciones",
        markAllRead: "Marcar todo como leído",
        noNotifications: "Sin notificaciones",
        viewAllNotifications: "Ver todas las notificaciones",
        myAccount: "Mi Cuenta",
        profile: "Perfil",
        switchAccount: "Cambiar cuenta",
        mockSwitch: "Seleccione otra cuenta (Mock)",
        logout: "Cerrar sesión",
        roles: {
          admin: "Administrador",
          manager: "Gestor",
          reader: "Lector",
          user: "Usuario"
        }
      },
      dashboard: {
        title: "Tablero",
        subtitle: "Visión general de su flota",
        stats: {
          totalVehículos: "Total Vehículos",
          inMaintenance: "En Mantenimiento",
          breakdowns: "Averías",
          availability: "Disponibilidad",
          activeReservations: "Reservas Activas",
          monthlyFuel: "Combustible (Mes)",
          activeDrivers: "Conductores Activos",
          monthlyCosts: "Costos (Mes)"
        },
        recentAlerts: {
          title: "Últimas alertas",
          viewAll: "Ver todo",
          noData: "No hay alertas recientes"
        },
        recentVehicles: {
          title: "Vehículos recientes",
          viewAll: "Ver todo",
          noData: "No hay vehículos",
          columns: {
            vehicle: "Vehículo",
            registration: "Matrícula",
            status: "Estado",
            fuel: "Combustible",
            mileage: "Kilometraje"
          }
        },
        charts: {
          maintenanceCosts: "Costos de mantenimiento",
          monthlyEvolution: "Evolución en los últimos 12 meses",
          thisYear: "Este año",
          cost: "Costo",
          month: "Mes",
          fuelConsumption: "Consumo de combustible",
          last6Months: "Últimos 6 meses",
          diesel: "Diésel",
          gasoline: "Gasolina",
          fleetStatus: "Estado de la flota",
          noVehicles: "Ningún vehículo registrado",
          vehicles: "vehículos"
        }
      },
      status: {
        urgent: "Urgente",
        warning: "Advertencia",
        info: "Info",
        available: "Disponible",
        onMission: "En misión",
        inMaintenance: "En mantenimiento",
        brokenDown: "Averiado",
        scheduled: "Programado",
        completed: "Completado",
        cancelled: "Cancelado"
      },
      vehicles: {
        title: "Vehículos",
        subtitle: "Gestione su flota de vehículos",
        add: "Agregar vehículo",
        addTitle: "Agregar nuevo vehículo",
        addDesc: "Complete los detalles del vehículo a continuación.",
        search: "Buscar un vehículo...",
        filterStatus: "Filtrar por estado",
        allStatuses: "Todos los estados",
        noData: "No se encontraron vehículos.",
        edit: "Editar vehículo",
        editTitle: "Editar vehículo",
        editDesc: "Modifique la información de este vehículo.",
        deleteTitle: "Eliminar vehículo",
        deleteDesc: "¿Está seguro de que desea eliminar el vehículo {{brand}} {{model}}? Esta acción es irreversible.",
        delete: "Eliminar",
        plate: "Matrícula",
        fuel: "Combustible",
        mileage: "Kilometraje",
        category: "Categoría",
        errorLoading: "Error al cargar los vehículos",
        form: {
          brand: "Marca",
          brandPlaceholder: "Ej: Renault",
          model: "Modelo",
          modelPlaceholder: "Ej: Kangoo",
          year: "Año",
          yearPlaceholder: "Ej: 2022",
          registration: "Matrícula",
          registrationPlaceholder: "Ej: 1234-ABC",
          fuel: "Tipo de combustible",
          selectPlaceholder: "Seleccionar...",
          category: "Categoría",
          mileage: "Kilometraje",
          photosTitle: "Fotos del vehículo",
          photo1: "Foto principal",
          photo2: "Foto 2 (Opcional)",
          photo3: "Foto 3 (Opcional)"
        }
      },
      reservations: {
        title: "Asignaciones",
        subtitle: "Gestione asignaciones y reservas",
        add: "Nueva Reserva",
        addTitle: "Agregar Reserva",
        addDesc: "Detalles de la reserva",
        search: "Buscar...",
        filterStatus: "Filtrar por estado",
        allStatuses: "Todos los estados",
        noData: "No se encontraron reservas.",
        stats: {
          total: "Reservas Totales",
          pending: "Pendiente",
          confirmed: "Confirmado",
          availableVehicles: "Vehículos Disponibles"
        },
        list: {
          unknownVehicle: "Vehículo desconocido",
          defaultPurpose: "Misión estándar",
          start: "Inicio",
          end: "Fin",
          confirm: "Confirmar",
          reject: "Rechazar",
          complete: "Completar"
        },
        form: {
          vehicle: "Vehículo",
          vehiclePlaceholder: "Seleccionar...",
          driver: "Conductor",
          driverPlaceholder: "Seleccionar...",
          startDate: "Fecha inicio",
          endDate: "Fecha fin",
          purpose: "Propósito",
          purposePlaceholder: "Ej: Reunión",
          destination: "Destino",
          destinationPlaceholder: "Ej: Madrid",
          notes: "Notas",
          notesPlaceholder: "Info adicional..."
        }
      },
      reports: {
        title: "Informes",
        subtitle: "Analice el rendimiento",
        period: "Período",
        category: "Categoría",
        generatePdf: "Generar PDF",
        generateExcel: "Generar Excel",
        periods: {
          week: "Esta semana",
          month: "Este mes",
          quarter: "Este trimestre",
          year: "Este año",
          all: "Todo"
        },
        categories: {
          all: "Todas",
          vehicles: "Vehículos",
          maintenance: "Mantenimiento",
          fuel: "Combustible",
          financial: "Financiero",
          drivers: "Conductores",
          breakdowns: "Averías",
          reservations: "Reservas"
        },
        stats: {
          title: "Estadísticas: {{period}}",
          activeVehicles: "Vehículos activos",
          maintenancesDone: "Mantenimientos",
          fuelConsumed: "Combustible (L)",
          totalCosts: "Costos totales"
        },
        downloading: {
          title: "Generando...",
          subtitle: "Por favor espere.",
          successTitle: "¡Éxito!",
          successDesc: "Archivo descargado.",
          errorTitle: "Error",
          errorDesc: "Error de generación.",
          notAvailable: "No disponible."
        },
        items: {
          fleetStatus: { title: "État du parc", desc: "Vue globale de l'état des véhicules." },
          vehiclesList: { title: "Liste des véhicules", desc: "Données brutes." },
          maintenanceReport: { title: "Rapport d'entretien", desc: "Résumé des interventions." },
          maintenanceData: { title: "Données d'entretien", desc: "Historique complet." },
          fuelConsumption: { title: "Consommation carburant", desc: "Analyse des pleins." },
          fuelLogs: { title: "Registres carburant", desc: "Historique brut." },
          financialReport: { title: "Rapport financier", desc: "Résumé des dépenses." },
          financialData: { title: "Données financières", desc: "Détail des dépenses." },
          driversList: { title: "Liste chauffeurs", desc: "Informations conducteurs." },
          driversData: { title: "Données chauffeurs", desc: "Export complet." },
          breakdownsReport: { title: "Rapport des pannes", desc: "Analyse des pannes." },
          breakdownsData: { title: "Données des pannes", desc: "Historique des pannes." },
          reservationsReport: { title: "Rapport réservations", desc: "Analyse utilisation." },
          reservationsData: { title: "Données réservations", desc: "Historique des affectations." }
        }
      },
      maintenance: {
        title: "Mantenimiento",
        subtitle: "Siga el mantenimiento de vehículos",
        add: "Agregar mantenimiento",
        addTitle: "Agregar mantenimiento",
        addDesc: "Programe o registre mantenimiento para un vehículo.",
        search: "Buscar mantenimiento...",
        filterStatus: "Filtrar por estado",
        allStatuses: "Todos los estados",
        noData: "No hay mantenimiento registrado.",
        errorLoading: "Error al cargar los mantenimientos",
        stats: {
          total: "Mantenimientos Totales",
          scheduled: "Programados",
          inProgress: "En Progreso",
          totalCost: "Costo Total"
        },
        list: {
          noDescription: "Sin descripción.",
          unknownVehicle: "Vehículo desconocido",
          date: "Fecha programada",
          mileage: "Kilometraje",
          cost: "Costo",
          next: "Próximo a"
        },
        form: {
          vehicle: "Vehículo",
          vehiclePlaceholder: "Seleccione un vehículo",
          type: "Tipo de servicio",
          typePlaceholder: "Ej: Cambio de aceite",
          types: {
            oilChange: "Cambio de aceite",
            brakes: "Frenos",
            tires: "Neumáticos",
            fullService: "Revisión completa",
            ac: "A/C",
            battery: "Batería",
            belt: "Correa",
            other: "Otro"
          },
          date: "Fecha (Opcional)",
          description: "Descripción",
          descriptionPlaceholder: "Detalles del servicio...",
          cost: "Costo (Opcional)",
          mileage: "Kilometraje actual (Opcional)",
          nextMileage: "Próximo servicio a (km, Opcional)"
        }
      },
      history: {
        title: "Historial",
        subtitle: "Consulte el historial de acciones",
        search: "Buscar...",
        filterType: "Filtrar por tipo",
        allTypes: "Todos los tipos",
        noDataTitle: "Sin historial",
        noDataFilter: "Ninguna acción coincide",
        noDataDesc: "El historial está vacío",
        types: {
          maintenance: "Mantenimiento",
          breakdown: "Avería",
          reservation: "Reserva",
          fuel: "Combustible"
        }
      },
      fuel: {
        title: "Combustible",
        subtitle: "Siga el consumo de combustible",
        add: "Agregar combustible",
        addTitle: "Agregar registro de combustible",
        addDesc: "Complete los detalles del combustible.",
        search: "Buscar registros...",
        noData: "No hay registros de combustible.",
        chartTitle: "Consumo de combustible",
        chartTooltip: "Combustible",
        errorLoading: "Error al cargar los registros de combustible",
        stats: {
          totalConsumed: "Total Consumido",
          totalCost: "Costo Total",
          recordedLogs: "Registros",
          avgCost: "Costo Prom. / L"
        },
        list: {
          unknownVehicle: "Vehículo desconocido",
          liters: "Litros",
          cost: "Costo",
        },
        form: {
          vehicle: "Vehículo",
          vehiclePlaceholder: "Seleccione un vehículo",
          driver: "Conductor",
          driverPlaceholder: "Seleccione un conductor (Opcional)",
          liters: "Volumen (Litros)",
          cost: "Costo",
          mileage: "Kilometraje",
          type: "Tipo de combustible",
          station: "Estación (Opcional)",
          stationPlaceholder: "Ej: Repsol, BP...",
          types: {
            diesel: "Diésel",
            gasoline: "Gasolina",
            hybrid: "Híbrido"
          }
        }
      },
      drivers: {
        title: "Conductores",
        subtitle: "Gestione su equipo de conductores",
        add: "Agregar",
        addTitle: "Agregar Conductor",
        addDesc: "Detalles del conductor",
        editTitle: "Editar",
        editDesc: "Modificar información",
        search: "Buscar...",
        noData: "Sin conductores",
        stats: {
          total: "Total",
          active: "Activos",
          expiring: "Licencia expirando",
        },
        list: {
          active: "Activo",
          inactive: "Inactivo",
          licenseNumber: "N° Licencia",
          expiry: "Expiración",
        },
        form: {
          fullName: "Nombre Completo",
          fullNamePlaceholder: "Ej: Juan Pérez",
          email: "Correo",
          emailPlaceholder: "juan@ejemplo.com",
          phone: "Teléfono",
          phonePlaceholder: "Ej: +34 123 456",
          licenseNumber: "Número de Licencia",
          licenseNumberPlaceholder: "Ej: 123456789",
          licenseExpiry: "Fecha de expiración",
        }
      },
      alerts: {
        title: "Alertas",
        subtitle: "Notificaciones del sistema",
        markAllRead: "Marcar todo como leído",
        actionRequired: "Acción requerida",
        noDataTitle: "Sin alertas",
        noDataDesc: "¡Estás al día! Sin nuevas notificaciones.",
        timeAgo: {
          minutes_one: "Hace {{count}} minuto",
          minutes_other: "Hace {{count}} minutos",
          hours_one: "Hace {{count}} hora",
          hours_other: "Hace {{count}} horas"
        },
        stats: {
          total: "Total",
          unread: "No leídas",
          urgent: "Urgentes"
        },
        filters: {
          priority: "Prioridad",
          allPriorities: "Todas las prioridades",
          type: "Tipo",
          allTypes: "Todos los tipos"
        },
        priorities: {
          urgent: "Urgente",
          warning: "Advertencia",
          info: "Info"
        },
        types: {
          breakdown: "Avería",
          maintenance: "Mantenimiento",
          reservation: "Reserva",
          insurance: "Seguro",
          inspection: "Inspección"
        }
      },
      breakdowns: {
        title: "Gestión de Averías",
        subtitle: "Reportar y rastrear averías de vehículos",
        searchPlaceholder: "Buscar una avería...",
        allStatus: "Todos los estados",
        filterStatus: "Filtrar por estado",
        cancel: "Cancelar",
        errorLoading: "Error al cargar las averías",
        stats: {
          open: "Averías abiertas",
          critical: "Críticas",
          resolved: "Resueltas"
        },
        criticalAlert: {
          text: "{{count}} avería(s) crítica(s) en curso",
          action: "Se requiere acción inmediata"
        },
        status: {
          open: "Abierta",
          in_progress: "En progreso",
          resolved: "Resuelta"
        },
        form: {
          declareTitle: "Reportar una avería",
          declareSubtitle: "Registrar una nueva avería en un vehículo",
          vehicle: "Vehículo",
          selectVehicle: "Seleccione un vehículo",
          description: "Descripción de la avería",
          descriptionPlaceholder: "Detalle el problema...",
          severity: "Severidad",
          severityLow: "Baja",
          severityMedium: "Media",
          severityHigh: "Alta",
          severityCritical: "Crítica",
          repairCost: "Costo de Reparación",
          resolutionNotes: "Notas de Resolución",
          resolutionNotesPlaceholder: "Detalle las reparaciones...",
          resolveTitle: "Resolver Avería",
          resolveSubtitle: "Ingrese los detalles de resolución",
          declareAction: "Reportar Avería",
          resolveAction: "Marcar como resuelta"
        }
      },
      settings: {
        title: "Ajustes",
        subtitle: "Administre sus preferencias y configuraciones administrativas",
        tabs: {
          profile: "Perfil",
          company: "Empresa",
          security: "Seguridad",
          notifications: "Notificaciones",
          preferences: "Preferencias",
          session: "Sesión"
        },
        profile: {
          title: "Información Personal",
          desc: "Actualice su información básica.",
          fullName: "Nombre completo",
          email: "Correo Electrónico",
          emailHelp: "La dirección de correo está vinculada a su cuenta de autenticación y no puede modificarse aquí.",
          save: "Guardar cambios",
          updatePhoto: "Actualizar foto",
          defaultUser: "Usuario",
          roles: {
            admin: "Administrador",
            manager: "Gestor",
            reader: "Lector"
          }
        },
        company: {
          title: "Configuración de la Empresa",
          desc: "Esta información aparecerá en sus informes y documentos PDF.",
          name: "Nombre de la empresa",
          siret: "Número SIRET / Registro",
          address: "Dirección completa",
          phone: "Teléfono de contacto",
          update: "Actualizar empresa"
        },
        security: {
          title: "Seguridad de la Cuenta",
          desc: "Gestione su contraseña y el acceso a su cuenta.",
          changePassword: "Cambiar Contraseña",
          newPassword: "Nueva Contraseña",
          confirmPassword: "Confirmar Contraseña",
          update: "Actualizar Contraseña",
          twoFactor: "Autenticación de dos factores (2FA)",
          twoFactorDesc: "Refuerce la seguridad de su cuenta de administrador.",
          comingSoon: "Próximamente",
          passwordMismatch: "Las contraseñas no coinciden",
          passwordLength: "La contraseña debe contener al menos 6 caracteres"
        },
        notifications: {
          title: "Preferencias de Notificación",
          desc: "Elija cómo y cuándo desea ser alertado.",
          urgentAlerts: "Alertas de averías urgentes",
          urgentAlertsDesc: "Notificación inmediata en la aplicación y por correo.",
          maintenanceReminders: "Recordatorios de mantenimiento",
          maintenanceRemindersDesc: "Ser alertado 7 días antes del vencimiento de un mantenimiento.",
          newReservations: "Nuevas reservas",
          newReservationsDesc: "Ser notificado cuando un usuario solicite un vehículo.",
          weeklyReport: "Informe semanal",
          weeklyReportDesc: "Recibir un resumen de gastos y actividades todos los lunes."
        },
        preferences: {
          title: "Preferencias del Sistema",
          desc: "Personalice la visualización de la aplicación según sus necesidades.",
          language: "Idioma de la Interfaz",
          dateFormat: "Formato de fecha",
          distance: "Unidad de distancia",
          currency: "Moneda Principal"
        },
        session: {
          title: "Gestión de Sesión",
          desc: "Gestione su conexión actual.",
          logout: "Cerrar sesión",
          logoutTitle: "Desconexión",
          logoutDesc: "Se cerrará su sesión actual en este dispositivo."
        },
        success: {
          profile: "Perfil actualizado",
          profileDesc: "Su información se ha guardado exitosamente.",
          company: "Empresa actualizada",
          companyDesc: "La información de la empresa se ha guardado.",
          photo: "Foto actualizada",
          photoDesc: "Su foto de perfil se ha modificado exitosamente."
        }
      },
      common: {
        save: "Guardar",
        cancel: "Cancelar",
        edit: "Editar",
        delete: "Eliminar"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
