const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const frReservations = `reservations: {
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
      },`;

const enReservations = `reservations: {
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
      },`;

const esReservations = `reservations: {
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
      },`;

const frDrivers = `drivers: {
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
      },`;

const enDrivers = `drivers: {
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
      },`;

const esDrivers = `drivers: {
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
      },`;

content = content.replace(/reservations:\s*{\s*title:\s*"Réservations",\s*subtitle:\s*"Gérez les assignations et réservations"\s*},/g, frReservations);
content = content.replace(/reservations:\s*{\s*title:\s*"Assignments",\s*subtitle:\s*"Manage assignments and reservations"\s*},/g, enReservations);
content = content.replace(/reservations:\s*{\s*title:\s*"Asignaciones",\s*subtitle:\s*"Gestione asignaciones y reservas"\s*},/g, esReservations);

content = content.replace(/drivers:\s*{\s*title:\s*"Chauffeurs",\s*subtitle:\s*"Gérez votre équipe de chauffeurs"\s*},/g, frDrivers);
content = content.replace(/drivers:\s*{\s*title:\s*"Drivers",\s*subtitle:\s*"Manage your driver team"\s*},/g, enDrivers);
content = content.replace(/drivers:\s*{\s*title:\s*"Conductores",\s*subtitle:\s*"Gestione su equipo de conductores"\s*},/g, esDrivers);

fs.writeFileSync(filePath, content, 'utf8');
console.log('i18n.ts updated successfully!');
