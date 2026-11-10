# IronLog – Gym Tracker (Version 0.2.1)

Mobile-first, offline-first Workout-Tracker als statische PWA für GitHub Pages.

## Starten
- `index.html` lokal über einen kleinen Webserver öffnen oder den Ordner auf GitHub Pages veröffentlichen.
- Für PWA-Installation und Service Worker ist HTTPS erforderlich (GitHub Pages liefert HTTPS).
- iPhone: Seite in Safari öffnen → Teilen → „Zum Home-Bildschirm“.
- Android: Chrome-Menü → „App installieren“ / „Zum Startbildschirm hinzufügen“.

## Was bereits funktioniert
- Lokale Datenspeicherung über IndexedDB (mit localStorage-Fallback)
- Workout starten, letzte Satzwerte als Vorschlag übernehmen, Sätze einzeln erfassen/abhaken, Übung hinzufügen/entfernen und Reihenfolge per Drag & Drop (Touch/Maus) oder Pfeilen ändern
- Manuell steuerbarer Pausentimer mit Standardzeit und Übungs-spezifischer Zeit
- Trainingspläne und Trainingstage erstellen/verwalten; Plan-Versionen bleiben als getrennte Pläne erhalten und nur eine Version je Planfamilie ist gleichzeitig aktiv
- Übungsbibliothek mit rund 200 Übungen inklusive umfangreicher Hammer-Strength-Auswahl, Suche, Filtern und eigenen Übungen
- Workout-Historie, Monats- und Wochenkalender, Trainingsvolumen, Gewichts- und Wiederholungsverlauf sowie Körperdaten
- JSON-Backup exportieren/importieren
- PWA-Manifest und Offline-App-Shell

## Noch nicht enthalten
- Supabase-Login und echte Cloud-Synchronisierung (benötigt ein Supabase-Projekt und dessen öffentliche Projekt-URL/Anon-Key)
- Konfliktfreie Synchronisierung mehrerer Geräte
- Cloud-zu-Lokal-Notfallwiederherstellung
- Vollständige englische UI-Übersetzung (die Sprachwahl ist vorbereitet; einzelne UI-Texte sind noch deutsch)
- Übungsbilder (Übungsinfos, Equipment, Muskelgruppe und Ausführung sind vorhanden; Bilder fehlen noch)

## Cloud später ergänzen
Die Cloud wird bewusst nicht vorgetäuscht. Für Supabase werden später benötigt:
1. Supabase-Projekt
2. Tabellen und Row Level Security pro Benutzer
3. Authentifizierung
4. Sync-Queue und Konfliktstrategie (lokale Daten bleiben bis zur bestätigten Synchronisierung erhalten)

**Wichtig:** Niemals den `service_role`-Key in den Frontend-Code eintragen. Nur den öffentlichen anon/publishable key verwenden und RLS korrekt konfigurieren.

## Version 0.2.1 – Änderungen
- Übungsdatenbank deutlich erweitert: Hammer Strength Plate-Loaded/MTS/Select sowie Maschinen, Kabel, Freihantel und Bodyweight.
- Trainingsplan-Editor speichert nur Sätze und Pausenzeit; Wiederholungen und Gewicht werden im Workout je Satz erfasst.
- Hell-/Dunkelmodus, Wochen-/Monatskalender, Profilfilter in der Historie und Wiederholungsdiagramm ergänzt.
- Eigene Übung kann direkt aus dem Workout-Übungsauswahldialog angelegt und übernommen werden.
- iOS-Eingabezoom verhindert (mindestens 16 px), lange Listen in Modals scrollbar, App-Icons im Offline-Cache.
- Datenmigration ergänzt: bestehende lokale Übungen, Pläne und Historie bleiben erhalten; neue Starter-Übungen werden ergänzt.

## Noch offen / externe Voraussetzung
- Cloud-Login, Sync und Cloud-Notfallwiederherstellung sind noch nicht aktiv. Dafür brauche ich deine Supabase-Projekt-URL und den öffentlichen anon/publishable Key; der Service-Role-Key gehört niemals in die App.
- Die UI ist noch nicht vollständig übersetzt und Übungsbilder fehlen.
- Mehrgeräte-Konfliktauflösung und echte iPhone-/Android-Gerätetests stehen noch aus.
