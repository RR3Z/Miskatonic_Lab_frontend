import type {
  CharacterStateRule,
  CharacterStateRuleKey,
} from "@/components/character/detail/types/character-state-rule.types"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"

export const characterStateRules: Record<
  CharacterStateRuleKey,
  CharacterStateRule
> = {
  majorWound: {
    acquisition:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .odnaAtakaNanositUronRavnyiIli,
    consequence:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .personazhPadaetIProhoditProverkuVyn,
    description:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .opasnoePovrezhdenieSposobnoePrivestiKSmerti,
    label:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .sereznayaRana,
    source:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .knigaHranitelyaGlava6BoiStr,
  },
  unconscious: {
    acquisition:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .zdorovePadaetDo0LiboProvalena,
    consequence:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .personazhNeMozhetDeistvovatNamerennayaPopytka,
    description:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .personazhNeVosprinimaetProishodyascheeINe,
    label:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .bezSoznaniya,
    source:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .knigaHranitelyaGlava6BoiStr,
  },
  dying: {
    acquisition:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .zdorovePadaetDo0PokaU,
    consequence:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .personazhTeryaetSoznanieISoSleduyuschego,
    description:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .kriticheskoeSostoyanieTrebuyuscheeNemedlennoiPomoschi,
    label:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .priSmerti,
    source:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .knigaHranitelyaGlava6BoiStr2,
  },
  dead: {
    acquisition:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .razovyiUronPrevyshaetMaksimalnoeZdoroveLibo,
    consequence:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .personazhPogibIBolsheNeMozhet,
    description:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .zhiznPersonazhaZavershilas,
    label:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules.mertv,
    source:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .knigaHranitelyaGlava6BoiStr2,
  },
  temporaryInsanity: {
    acquisition:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .personazhTeryaet5IliBolshePunktov,
    consequence:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .sostoyanieNachinaetsyaNemedlennoIDlitsya1d10,
    description:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .kratkovremennyiPsihicheskiiSryvPosleSilnoiTravmy,
    label:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .vremennoeBezumie,
    source:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .knigaHranitelyaGlava8RassudokStr,
  },
  indefiniteInsanity: {
    acquisition:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .zaOdinIgrovoiDenPersonazhTeryaet,
    consequence:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .sostoyanieProdolzhaetsyaPokaPersonazhaNeVylechat,
    description:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .prodolzhitelnoeRasstroistvoRassudka,
    label:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .bessrochnoeBezumie,
    source:
      localizedContent.copy.componentsCharacterDetailCharacterStateRules
        .knigaHranitelyaGlava8RassudokStr2,
  },
}
