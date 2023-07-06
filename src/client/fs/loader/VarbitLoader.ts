import { Archive } from "../Archive";
import { CacheInfo } from "../CacheInfo";
import { VarbitDefinition } from "../definition/VarbitDefinition";
import {
    ArchiveDefinitionLoader,
    CachedArchiveDefinitionLoader,
} from "./DefinitionLoader";

export class VarbitLoader extends ArchiveDefinitionLoader<VarbitDefinition> {
    constructor(archive: Archive, cacheInfo: CacheInfo) {
        super(archive, VarbitDefinition, cacheInfo);
    }
}

export class CachedVarbitLoader extends CachedArchiveDefinitionLoader<VarbitDefinition> {
    constructor(archive: Archive, cacheInfo: CacheInfo) {
        super(archive, VarbitDefinition, cacheInfo);
    }
}
