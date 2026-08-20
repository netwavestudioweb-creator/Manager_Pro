const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n.ts');
let content = fs.readFileSync(filePath, 'utf8');

const enSettings = `settings: {
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
          save: "Save Changes",
          updatePhoto: "Update Photo",
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
          siret: "Registration Number",
          address: "Full Address",
          phone: "Contact Phone",
          update: "Update Company"
        },
        security: {
          title: "Account Security",
          desc: "Manage your password and account access.",
          changePassword: "Change Password",
          newPassword: "New Password",
          confirmPassword: "Confirm Password",
          update: "Update Password",
          twoFactor: "Two-Factor Authentication (2FA)",
          twoFactorDesc: "Enhance the security of your administrator account.",
          comingSoon: "Coming soon",
          passwordMismatch: "Passwords do not match",
          passwordLength: "Password must be at least 6 characters long"
        },
        notifications: {
          title: "Notification Preferences",
          desc: "Choose how and when you want to be alerted.",
          urgentAlerts: "Urgent breakdown alerts",
          urgentAlertsDesc: "Immediate notification in the app and via email.",
          maintenanceReminders: "Maintenance reminders",
          maintenanceRemindersDesc: "Be alerted 7 days before maintenance is due.",
          newReservations: "New reservations",
          newReservationsDesc: "Be notified when a user requests a vehicle.",
          weeklyReport: "Weekly report",
          weeklyReportDesc: "Receive a summary of expenses and activities every Monday."
        },
        preferences: {
          title: "System Preferences",
          desc: "Customize the application display according to your needs.",
          language: "Interface Language",
          dateFormat: "Date Format",
          distance: "Distance Unit",
          currency: "Primary Currency"
        },
        session: {
          title: "Session Management",
          desc: "Manage your current connection.",
          logout: "Log out",
          logoutTitle: "Logging out",
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
      },`;

const esSettings = `settings: {
        title: "Ajustes",
        subtitle: "Configure su cuenta y aplicación",
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
          fullName: "Nombre Completo",
          email: "Dirección de Correo",
          emailHelp: "La dirección de correo está vinculada a su cuenta de autenticación y no puede modificarse aquí.",
          save: "Guardar Cambios",
          updatePhoto: "Actualizar Foto",
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
          name: "Nombre de la Empresa",
          siret: "Número de Registro",
          address: "Dirección Completa",
          phone: "Teléfono de Contacto",
          update: "Actualizar Empresa"
        },
        security: {
          title: "Seguridad de la Cuenta",
          desc: "Gestione su contraseña y el acceso a su cuenta.",
          changePassword: "Cambiar Contraseña",
          newPassword: "Nueva Contraseña",
          confirmPassword: "Confirmar Contraseña",
          update: "Actualizar Contraseña",
          twoFactor: "Autenticación de Dos Factores (2FA)",
          twoFactorDesc: "Mejore la seguridad de su cuenta de administrador.",
          comingSoon: "Próximamente",
          passwordMismatch: "Las contraseñas no coinciden",
          passwordLength: "La contraseña debe tener al menos 6 caracteres"
        },
        notifications: {
          title: "Preferencias de Notificación",
          desc: "Elija cómo y cuándo desea ser alertado.",
          urgentAlerts: "Alertas de averías urgentes",
          urgentAlertsDesc: "Notificación inmediata en la aplicación y por correo.",
          maintenanceReminders: "Recordatorios de mantenimiento",
          maintenanceRemindersDesc: "Reciba una alerta 7 días antes del mantenimiento.",
          newReservations: "Nuevas reservas",
          newReservationsDesc: "Reciba una notificación cuando se solicite un vehículo.",
          weeklyReport: "Informe semanal",
          weeklyReportDesc: "Reciba un resumen de gastos y actividades cada lunes."
        },
        preferences: {
          title: "Preferencias del Sistema",
          desc: "Personalice la visualización de la aplicación según sus necesidades.",
          language: "Idioma de la Interfaz",
          dateFormat: "Formato de Fecha",
          distance: "Unidad de Distancia",
          currency: "Moneda Principal"
        },
        session: {
          title: "Gestión de Sesión",
          desc: "Gestione su conexión actual.",
          logout: "Cerrar sesión",
          logoutTitle: "Cerrando sesión",
          logoutDesc: "Saldrá de su sesión actual en este dispositivo."
        },
        success: {
          profile: "Perfil actualizado",
          profileDesc: "Su información se ha guardado correctamente.",
          company: "Empresa actualizada",
          companyDesc: "La información de la empresa se ha guardado.",
          photo: "Foto actualizada",
          photoDesc: "Su foto de perfil se ha modificado correctamente."
        }
      },`;

content = content.replace(/settings:\s*{\s*title:\s*"Settings",\s*subtitle:\s*"Configure your account and application"\s*},/g, enSettings);
content = content.replace(/settings:\s*{\s*title:\s*"Ajustes",\s*subtitle:\s*"Configure su cuenta y aplicación"\s*},/g, esSettings);

fs.writeFileSync(filePath, content, 'utf8');
console.log('i18n.ts settings updated successfully!');
