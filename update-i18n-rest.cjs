const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const frAlerts = `alerts: {
        title: "Alertes",
        subtitle: "Notifications du système",
        markAllRead: "Tout marquer comme lu",
        actionRequired: "Action requise",
        noDataTitle: "Aucune alerte",
        noDataDesc: "Vous êtes à jour ! Aucune nouvelle notification.",
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
          warning: "Attention",
          info: "Info"
        },
        types: {
          breakdown: "Panne",
          maintenance: "Entretien",
          reservation: "Réservation",
          insurance: "Assurance",
          inspection: "Contrôle"
        }
      },`;

const frHistory = `history: {
        title: "Historique",
        subtitle: "Consultez l'historique des actions",
        search: "Rechercher...",
        filterType: "Filtrer par type",
        allTypes: "Tous les types",
        noDataTitle: "Aucun historique",
        noDataFilter: "Aucune action ne correspond à vos critères",
        noDataDesc: "L'historique des actions est vide",
        types: {
          maintenance: "Entretien",
          breakdown: "Panne",
          reservation: "Réservation",
          fuel: "Carburant"
        }
      },`;

const frReports = `reports: {
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
      },`;

const enAlerts = frAlerts.replace(/"Alertes"/g, '"Alerts"').replace(/"Notifications du système"/g, '"System Notifications"').replace(/"Tout marquer comme lu"/g, '"Mark all as read"').replace(/"Action requise"/g, '"Action required"').replace(/"Aucune alerte"/g, '"No alerts"').replace(/"Vous êtes à jour ! Aucune nouvelle notification."/g, '"You are up to date! No new notifications."').replace(/"Il y a \{\{count\}\} minute"/g, '"{{count}} minute ago"').replace(/"Il y a \{\{count\}\} minutes"/g, '"{{count}} minutes ago"').replace(/"Il y a \{\{count\}\} heure"/g, '"{{count}} hour ago"').replace(/"Il y a \{\{count\}\} heures"/g, '"{{count}} hours ago"').replace(/"Total"/g, '"Total"').replace(/"Non lues"/g, '"Unread"').replace(/"Urgentes"/g, '"Urgent"').replace(/"Priorité"/g, '"Priority"').replace(/"Toutes les priorités"/g, '"All priorities"').replace(/"Type"/g, '"Type"').replace(/"Tous les types"/g, '"All types"').replace(/"Urgent"/g, '"Urgent"').replace(/"Attention"/g, '"Warning"').replace(/"Info"/g, '"Info"').replace(/"Panne"/g, '"Breakdown"').replace(/"Entretien"/g, '"Maintenance"').replace(/"Réservation"/g, '"Reservation"').replace(/"Assurance"/g, '"Insurance"').replace(/"Contrôle"/g, '"Inspection"');

const enHistory = frHistory.replace(/"Historique"/g, '"History"').replace(/"Consultez l'historique des actions"/g, '"View action history"').replace(/"Rechercher..."/g, '"Search..."').replace(/"Filtrer par type"/g, '"Filter by type"').replace(/"Tous les types"/g, '"All types"').replace(/"Aucun historique"/g, '"No history"').replace(/"Aucune action ne correspond à vos critères"/g, '"No actions match your criteria"').replace(/"L'historique des actions est vide"/g, '"Action history is empty"').replace(/"Entretien"/g, '"Maintenance"').replace(/"Panne"/g, '"Breakdown"').replace(/"Réservation"/g, '"Reservation"').replace(/"Carburant"/g, '"Fuel"');

const enReports = frReports.replace(/"Rapports"/g, '"Reports"').replace(/"Analysez les performances de votre flotte"/g, '"Analyze your fleet performance"').replace(/"Période"/g, '"Period"').replace(/"Catégorie"/g, '"Category"').replace(/"Générer PDF"/g, '"Generate PDF"').replace(/"Générer Excel"/g, '"Generate Excel"').replace(/"Cette semaine"/g, '"This week"').replace(/"Ce mois"/g, '"This month"').replace(/"Ce trimestre"/g, '"This quarter"').replace(/"Cette année"/g, '"This year"').replace(/"Tout"/g, '"All"').replace(/"Toutes"/g, '"All"').replace(/"Véhicules"/g, '"Vehicles"').replace(/"Entretien"/g, '"Maintenance"').replace(/"Carburant"/g, '"Fuel"').replace(/"Finances"/g, '"Financial"').replace(/"Chauffeurs"/g, '"Drivers"').replace(/"Pannes"/g, '"Breakdowns"').replace(/"Réservations"/g, '"Reservations"').replace(/"Statistiques : \{\{period\}\}"/g, '"Stats: {{period}}"').replace(/"Véhicules actifs"/g, '"Active vehicles"').replace(/"Entretiens"/g, '"Maintenances"').replace(/"Carburant \(L\)"/g, '"Fuel (L)"').replace(/"Coûts totaux"/g, '"Total costs"').replace(/"Génération..."/g, '"Generating..."').replace(/"Veuillez patienter."/g, '"Please wait."').replace(/"Succès !"/g, '"Success!"').replace(/"Le fichier a été téléchargé."/g, '"File downloaded successfully."').replace(/"Erreur"/g, '"Error"').replace(/"Échec de la génération."/g, '"Generation failed."').replace(/"Non disponible."/g, '"Not available."');

const esAlerts = frAlerts.replace(/"Alertes"/g, '"Alertas"').replace(/"Notifications du système"/g, '"Notificaciones del sistema"').replace(/"Tout marquer comme lu"/g, '"Marcar todo como leído"').replace(/"Action requise"/g, '"Acción requerida"').replace(/"Aucune alerte"/g, '"Sin alertas"').replace(/"Vous êtes à jour ! Aucune nouvelle notification."/g, '"¡Estás al día! Sin nuevas notificaciones."').replace(/"Il y a \{\{count\}\} minute"/g, '"Hace {{count}} minuto"').replace(/"Il y a \{\{count\}\} minutes"/g, '"Hace {{count}} minutos"').replace(/"Il y a \{\{count\}\} heure"/g, '"Hace {{count}} hora"').replace(/"Il y a \{\{count\}\} heures"/g, '"Hace {{count}} horas"').replace(/"Total"/g, '"Total"').replace(/"Non lues"/g, '"No leídas"').replace(/"Urgentes"/g, '"Urgentes"').replace(/"Priorité"/g, '"Prioridad"').replace(/"Toutes les priorités"/g, '"Todas las prioridades"').replace(/"Type"/g, '"Tipo"').replace(/"Tous les types"/g, '"Todos los tipos"').replace(/"Urgent"/g, '"Urgente"').replace(/"Attention"/g, '"Advertencia"').replace(/"Info"/g, '"Info"').replace(/"Panne"/g, '"Avería"').replace(/"Entretien"/g, '"Mantenimiento"').replace(/"Réservation"/g, '"Reserva"').replace(/"Assurance"/g, '"Seguro"').replace(/"Contrôle"/g, '"Inspección"');

const esHistory = frHistory.replace(/"Historique"/g, '"Historial"').replace(/"Consultez l'historique des actions"/g, '"Consulte el historial de acciones"').replace(/"Rechercher..."/g, '"Buscar..."').replace(/"Filtrer par type"/g, '"Filtrar por tipo"').replace(/"Tous les types"/g, '"Todos los tipos"').replace(/"Aucun historique"/g, '"Sin historial"').replace(/"Aucune action ne correspond à vos critères"/g, '"Ninguna acción coincide"').replace(/"L'historique des actions est vide"/g, '"El historial está vacío"').replace(/"Entretien"/g, '"Mantenimiento"').replace(/"Panne"/g, '"Avería"').replace(/"Réservation"/g, '"Reserva"').replace(/"Carburant"/g, '"Combustible"');

const esReports = frReports.replace(/"Rapports"/g, '"Informes"').replace(/"Analysez les performances de votre flotte"/g, '"Analice el rendimiento"').replace(/"Période"/g, '"Período"').replace(/"Catégorie"/g, '"Categoría"').replace(/"Générer PDF"/g, '"Generar PDF"').replace(/"Générer Excel"/g, '"Generar Excel"').replace(/"Cette semaine"/g, '"Esta semana"').replace(/"Ce mois"/g, '"Este mes"').replace(/"Ce trimestre"/g, '"Este trimestre"').replace(/"Cette année"/g, '"Este año"').replace(/"Tout"/g, '"Todo"').replace(/"Toutes"/g, '"Todas"').replace(/"Véhicules"/g, '"Vehículos"').replace(/"Entretien"/g, '"Mantenimiento"').replace(/"Carburant"/g, '"Combustible"').replace(/"Finances"/g, '"Financiero"').replace(/"Chauffeurs"/g, '"Conductores"').replace(/"Pannes"/g, '"Averías"').replace(/"Réservations"/g, '"Reservas"').replace(/"Statistiques : \{\{period\}\}"/g, '"Estadísticas: {{period}}"').replace(/"Véhicules actifs"/g, '"Vehículos activos"').replace(/"Entretiens"/g, '"Mantenimientos"').replace(/"Carburant \(L\)"/g, '"Combustible (L)"').replace(/"Coûts totaux"/g, '"Costos totales"').replace(/"Génération..."/g, '"Generando..."').replace(/"Veuillez patienter."/g, '"Por favor espere."').replace(/"Succès !"/g, '"¡Éxito!"').replace(/"Le fichier a été téléchargé."/g, '"Archivo descargado."').replace(/"Erreur"/g, '"Error"').replace(/"Échec de la génération."/g, '"Error de generación."').replace(/"Non disponible."/g, '"No disponible."');


// FR Replacements
content = content.replace(/alerts:\s*{\s*title:\s*"Alertes",\s*subtitle:\s*"Notifications du système"\s*},/g, frAlerts);
content = content.replace(/history:\s*{\s*title:\s*"Historique",\s*subtitle:\s*"Consultez l'historique des actions"\s*},/g, frHistory);
content = content.replace(/reports:\s*{\s*title:\s*"Rapports",\s*subtitle:\s*"Analysez les performances de votre flotte"\s*},/g, frReports);

// EN Replacements
content = content.replace(/alerts:\s*{\s*title:\s*"Alerts",\s*subtitle:\s*"System notifications"\s*},/g, enAlerts);
content = content.replace(/history:\s*{\s*title:\s*"History",\s*subtitle:\s*"View action history"\s*},/g, enHistory);
content = content.replace(/reports:\s*{\s*title:\s*"Reports",\s*subtitle:\s*"Analyze your fleet performance"\s*},/g, enReports);

// ES Replacements
content = content.replace(/alerts:\s*{\s*title:\s*"Alertas",\s*subtitle:\s*"Notificaciones del sistema"\s*},/g, esAlerts);
content = content.replace(/history:\s*{\s*title:\s*"Historial",\s*subtitle:\s*"Consulte el historial de acciones"\s*},/g, esHistory);
content = content.replace(/reports:\s*{\s*title:\s*"Informes",\s*subtitle:\s*"Analice el rendimiento de su flota"\s*},/g, esReports);

fs.writeFileSync(filePath, content, 'utf8');
console.log('i18n.ts alerts, history, reports updated successfully!');
