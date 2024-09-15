
import "reflect-metadata";
import { Container } from "inversify";
import { LayerStoreLoaderService } from "./features/layer/services/layer-store-loader.service";
import { SurfaceStoreLoaderService } from "./features/surface/services/surface-loader/surface-loader.service";
import { SurfaceService } from "./features/surface/services/surface/surface.service";
import { SceneStoreLoaderService } from "./features/display/services/scene/scene-store-loader/scene-store-loader.service";
import { LayerFactoryService } from "./features/layer/services/layer-factory.service";
import { LayerDirectoryService } from "./features/layer/services/layer-directory.service";

export const container = new Container({ defaultScope: 'Singleton'});

container.bind(LayerDirectoryService).toSelf();
container.bind(LayerFactoryService).toSelf();
container.bind(LayerStoreLoaderService).toSelf();

container.bind(SceneStoreLoaderService).toSelf();

container.bind(SurfaceStoreLoaderService).toSelf();
container.bind(SurfaceService).toSelf();

