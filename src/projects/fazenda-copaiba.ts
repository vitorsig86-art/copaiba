import type { GeographicBounds, ProjectConfig, ProjectLayerConfig } from "./types";
import { templateProject } from "./template";

// Valores reais do projeto fazenda-copaiba. template.ts guarda só exemplos genéricos
// usados por npm run check: não coloque dados da propriedade nele.
// Passo a passo: docs/NOVO-PROJETO.md (exemplo real comentado: projeto Cyro).
const basemap = templateProject.layers[0];
const r2 = "https://pub-1efc3db5b39647fbb20c6e00df59bedd.r2.dev";

// Bounding boxes dos XMLs fornecidos, convertidos de EPSG:3857 para graus
// WGS84 com WebMercatorProjection do Cesium; limites arredondados para fora.
const orthoBounds: GeographicBounds = [-46.054687501, -22.431340157, -45.878906249, -22.105998799];
const terrainBounds: GeographicBounds = [-46.406250001, -22.593726065, -45.703124999, -21.943045533];
const reliefBounds: GeographicBounds = [-46.406250001, -23.241346103, -44.999999999, -21.943045533];

const raster = (
  id: string, name: string, kind: ProjectLayerConfig["kind"], bounds: GeographicBounds,
  minimumLevel: number, maximumLevel: number, defaultVisible = false,
): ProjectLayerConfig => ({
  id, name, description: "", kind, group: "raster", defaultVisible,
  ...(kind === "orthomosaic" ? { legendMode: "none" as const } : { exclusiveGroup: "derivados" }),
  source: {
    format: "tms", url: `${r2}/${id}/{z}/{x}/{reverseY}.png`, credit: "Cardeal Map",
    bounds, minimumLevel, maximumLevel, tileWidth: 256, tileHeight: 256,
  },
});

const rasters: ProjectLayerConfig[] = [
  raster("orto", "Ortomosaico", "orthomosaic", orthoBounds, 11, 20, true),
  raster("mdt", "Modelo Digital do Terreno", "dtm", terrainBounds, 9, 18),
  raster("mds", "Modelo Digital de Superfície", "dsm", terrainBounds, 9, 18),
  raster("decli", "Mapa da Declividade", "slope", reliefBounds, 8, 17),
  raster("aspect", "Mapa da Orientação das Vertentes", "aspect", reliefBounds, 8, 17),
];

const model: ProjectLayerConfig = {
  id: "modelo-3d",
  name: "Modelo 3D",
  description: "",
  kind: "3d-tiles",
  defaultVisible: false,
  source: {
    format: "3d-tiles", source: "ion", assetId: 4475217, tokenEnv: "VITE_CESIUM_ION_TOKEN",
    clipping: {
      enabled: true,
      inverse: true,
      positions: [
        [-46.0110695, -22.2706925],
        [-46.0083967, -22.2739966],
        [-46.0126561, -22.2778385],
        [-46.0128823, -22.2822060],
        [-46.0028395, -22.2904886],
        [-46.0014092, -22.2925878],
        [-45.9952249, -22.2938817],
        [-45.9915746, -22.2890624],
        [-45.9876546, -22.2863959],
        [-45.9823748, -22.2759245],
        [-45.9832138, -22.2744364],
        [-45.9925231, -22.2747955],
        [-46.0021889, -22.2626031],
      ],
    },
  },
};

// Camadas declaradas no CAR; a visualização não estabelece regularidade jurídica.
const carLayers: ProjectLayerConfig[] = [
  {
    id: "car-consolidada", name: "Área Consolidada", description: "Área declarada no CAR",
    kind: "vector", subsection: "Cadastro Ambiental Rural (CAR)", panelOrder: 4, defaultVisible: false, opacityControl: true,
    source: { format: "geojson", url: `${r2}/geojson/area_consolidada_car.geojson`, autoZoom: false,
      style: { stroke: "#D49A26", strokeWidth: 1.5, fill: "#E5AA32", fillOpacity: 0.35, clampToGround: true, zIndex: 1 },
      popup: { title: "Área Consolidada — CAR", fields: [] } },
  },
  {
    id: "car-app", name: "Área de Preservação Permanente (APP)", description: "APP declarada no CAR",
    kind: "vector", subsection: "Cadastro Ambiental Rural (CAR)", panelOrder: 5, defaultVisible: false, opacityControl: true,
    source: { format: "geojson", url: `${r2}/geojson/app_car.geojson`, autoZoom: false,
      style: { stroke: "#42A88F", strokeWidth: 1.5, fill: "#71D3B5", fillOpacity: 0.35, clampToGround: true, zIndex: 2 },
      popup: { title: "APP — CAR", fields: [] } },
  },
  {
    id: "car-reserva-legal", name: "Reserva Legal", description: "Reserva Legal declarada no CAR",
    kind: "vector", subsection: "Cadastro Ambiental Rural (CAR)", panelOrder: 6, defaultVisible: false, opacityControl: true,
    source: { format: "geojson", url: `${r2}/geojson/reserva_legal_car.geojson`, autoZoom: false,
      style: { stroke: "#14532D", strokeWidth: 1.5, fill: "#166534", fillOpacity: 0.35, clampToGround: true, zIndex: 3 },
      popup: { title: "Reserva Legal — CAR", fields: [] } },
  },
  {
    id: "car-vegetacao", name: "Vegetação Nativa", description: "Vegetação Nativa declarada no CAR",
    kind: "vector", subsection: "Cadastro Ambiental Rural (CAR)", panelOrder: 7, defaultVisible: false, opacityControl: true,
    source: { format: "geojson", url: `${r2}/geojson/vegetacao_nativa_car.geojson`, autoZoom: false,
      style: { stroke: "#3B7D32", strokeWidth: 1.5, fill: "#58A648", fillOpacity: 0.35, clampToGround: true, zIndex: 4 },
      popup: { title: "Vegetação Nativa — CAR", fields: [] } },
  },
  {
    id: "car-hidrografia", name: "Hidrografia CAR", description: "Hidrografia disponibilizada no CAR",
    kind: "vector", subsection: "Cadastro Ambiental Rural (CAR)", panelOrder: 8, defaultVisible: false, opacityControl: true,
    source: { format: "geojson", url: `${r2}/geojson/hidrografia_car.geojson`, autoZoom: false,
      style: { stroke: "#1689D4", strokeWidth: 2, fill: "#1689D4", fillOpacity: 0.35, clampToGround: true, zIndex: 15 },
      popup: { title: "Hidrografia — CAR", fields: [] } },
  },
];

// Ordem de desenho dos GeoJSONs: CAR, curvas, drenagem e perímetro.
const vectors: ProjectLayerConfig[] = [
  {
    id: "curvas-3m", name: "Curvas de Nível — 3 m", description: "Curvas com equidistância de 3 m",
    kind: "contours", defaultVisible: false, panelOrder: 2,
    source: {
      format: "geojson", url: `${r2}/geojson/curvas_3m.geojson`, autoZoom: false,
      style: { stroke: "#000000", strokeWidth: 1, clampToGround: true, zIndex: 5 },
      popup: { title: "Curva de nível", fields: [{ property: "ELEVATION", label: "Cota (m)" }] },
    },
  },
  {
    id: "drenagem", name: "Linhas de Drenagem", description: "Drenagem potencial derivada de modelagem digital do terreno",
    kind: "drainage", defaultVisible: false, panelOrder: 3,
    source: {
      format: "geojson", url: `${r2}/geojson/linhas_drenagem.geojson`, autoZoom: false,
      symbology: "simulated-drainage-strahler",
      popup: { title: "Drenagem potencial modelada", fields: [
        { property: "STRAHLER", label: "Ordem de Strahler" },
        { property: "STREAM_ID", label: "Identificador do trecho" },
        { property: "IN_FLOW", label: "Fluxo de entrada" },
        { property: "OUT_FLOW", label: "Fluxo de saída" },
        { property: "DRAIN_AREA", label: "Área de drenagem (unidade da fonte)" },
      ] },
    },
  },
  {
    id: "perimetro", name: "Perímetro do Imóvel", description: "Fazenda Copaíba",
    kind: "property-boundary", defaultVisible: true, panelOrder: 1,
    source: {
      format: "geojson", url: `${r2}/geojson/area_peri.geojson`, autoZoom: false,
      style: { stroke: "#FFD400", strokeWidth: 2.5, fillOpacity: 0, clampToGround: true, zIndex: 20 },
      popup: { title: "Fazenda Copaíba — Perímetro do Imóvel", fields: [] },
    },
  },
];

export const project: ProjectConfig = {
  ...templateProject,
  id: "fazenda-copaiba",
  name: "Fazenda Copaíba WebGIS",
  location: "Pouso Alegre, MG",
  // Área do projeto [W, S, E, N] em graus; define o limite de navegação.
  // Ausente = sem limite. Capture com "Capturar bounds da vista" (npm run dev).
  // bounds: [W, S, E, N],
  // Opcional: navigation: { marginRatio: 0.25, maximumZoomDistance: 5000 },
  // Vista oficial de abertura e Home: ângulos em graus, altura em metros sobre o elipsoide.
  initialCamera: { longitude: -45.9989371, latitude: -22.2911213, height: 2926.4, heading: 358.65, pitch: -59.27, roll: 0 },
  // Ordem = empilhamento: o último item fica por cima.
  layers: [basemap, ...rasters, model, ...carLayers, ...vectors],
  panel: { sectionTitles: { vector: "Vetores Micro" } },
  scenes: [],
  diagnostic: { steps: [] },
  developmentTools: { modelAlignment: false, cropAuthoring: false, cameraCapture: false },
};
