<template>
<div class="c-menu-button c-ctrl-wrapper c-ctrl-wrapper--menus-left">
    <button
        class="c-icon-button c-button--menu icon-camera"
        title="Take a Notebook Snapshot"
        @click.stop.prevent="showMenu"
    >
        <span
            title="Take Notebook Snapshot"
            class="c-icon-button__label"
        >
            Snapshot
        </span>
    </button>
</div>
</template>

<script>
import Snapshot from '../snapshot';
import { getDefaultNotebook, validateNotebookStorageObject } from '../utils/notebook-storage';
import { NOTEBOOK_DEFAULT, NOTEBOOK_SNAPSHOT } from '../notebook-constants';
import { getMenuItems } from '../utils/notebook-snapshot-menu';

export default {
    inject: ['openmct'],
    props: {
        currentView: {
            type: Object,
            default() {
                return {};
            }
        },
        domainObject: {
            type: Object,
            default() {
                return {};
            }
        },
        isPreview: {
            type: Boolean,
            default() {
                return false;
            }
        },
        objectPath: {
            type: Array,
            default() {
                return null;
            }
        }
    },
    data() {
        return {
            notebookSnapshot: undefined,
            notebookTypes: []
        };
    },
    mounted() {
        validateNotebookStorageObject();
        this.getDefaultNotebookObject();

        this.notebookSnapshot = new Snapshot(this.openmct);
        this.setDefaultNotebookStatus();
    },
    methods: {
        async getDefaultNotebookObject() {
            const defaultNotebook = getDefaultNotebook();
            const defaultNotebookObject = defaultNotebook && await this.openmct.objects.get(defaultNotebook.notebookMeta.identifier);

            return defaultNotebookObject;
        },
        getPreviewObjectLink() {
            let path = '#/browse/';
            path += this.objectPath
                .map(p => this.openmct.objects.makeKeyString(p.identifier))
                .reverse()
                .join('/')
            ;
            path += `?view=${this.currentView.key}`;

            const urlParams = this.openmct.router.getParams();
            Object.entries(urlParams)
                .forEach(([key, value]) => {
                    if (key === 'view') {
                        return;
                    }

                    path += `&${key}=${value}`;
                });

            return path;
        },
        async showMenu(event) {
            const menuItemOptions = {
                default: {
                    cssClass: 'icon-notebook',
                    name: `Save to Notebook`,
                    onItemClicked: () => this.snapshot(NOTEBOOK_DEFAULT)
                },
                snapshot: {
                    cssClass: 'icon-camera',
                    name: 'Save to Notebook Snapshots',
                    onItemClicked: () => this.snapshot(NOTEBOOK_SNAPSHOT)
                }
            };

            const notebookTypes = await getMenuItems(this.openmct, menuItemOptions);
            const elementBoundingClientRect = this.$el.getBoundingClientRect();
            const x = elementBoundingClientRect.x;
            const y = elementBoundingClientRect.y + elementBoundingClientRect.height;
            this.openmct.menus.showMenu(x, y, notebookTypes);
        },
        snapshot(notebookType) {
            this.$nextTick(() => {
                const element = this.isPreview
                    ? document.querySelector('.l-preview-window__object-view')
                    : document.querySelector('.c-overlay__contents') || document.querySelector('.l-shell__main-container');
                const objectPath = this.objectPath || this.openmct.router.path;
                const link = this.isPreview
                    ? this.getPreviewObjectLink()
                    : window.location.hash;
                const snapshotMeta = {
                    bounds: this.openmct.time.bounds(),
                    link,
                    objectPath,
                    openmct: this.openmct
                };

                this.notebookSnapshot.capture(snapshotMeta, notebookType, element);
            });
        },
        setDefaultNotebookStatus() {
            let defaultNotebookObject = getDefaultNotebook();

            if (defaultNotebookObject && defaultNotebookObject.notebookMeta) {
                let notebookIdentifier = defaultNotebookObject.notebookMeta.identifier;

                this.openmct.status.set(notebookIdentifier, 'notebook-default');
            }
        }
    }
};
</script>
