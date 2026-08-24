import type { Locale } from "./routing";

const namespaces = [
  ["Common", "common"],
  ["Navbar", "navbar"],
  ["Footer", "footer"],
  ["TalkToUsPanel", "talk-to-us"],
  ["HomePage", "home"],
  ["AboutPage", "about"],
  ["PartnersPage", "partners"],
  ["PlatformPage", "platform"],
  ["ResourcesPage", "resources"],
  ["SolutionsPage", "solutions"],
  ["DigitalSignageMediaPage", "digital-signage-media"],
  ["CommunicationPage", "communication"],
  ["ThunderCarePage", "thunder-care"],
  ["AssetIntelligencePage", "asset-intelligence"],
  ["AssetIntelligenceProductTour", "asset-intelligence-product-tour"],
  ["UseCasesPage", "use-cases"],
  ["UseCaseDetailAnnounceAllEmployeesPage", "use-case-detail-announce-all-employees"],
] as const;

export async function loadMessages(locale: Locale) {
  const entries = await Promise.all(
    namespaces.map(async ([key, file]) => {
      const messages = (await import(`../../messages/${locale}/${file}.json`))
        .default;
      return [key, messages] as const;
    }),
  );

  return Object.fromEntries(entries);
}
