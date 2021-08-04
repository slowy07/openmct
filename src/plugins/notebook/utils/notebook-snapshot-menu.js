import { getDefaultNotebook } from './notebook-storage';

export async function getMenuItems(openmct, menuItemOptions) {
    const notebookTypes = [];

    const defaultNotebook = getDefaultNotebook();
    const defaultNotebookObject = defaultNotebook && await openmct.objects.get(defaultNotebook.notebookMeta.identifier);
    if (defaultNotebookObject) {
        const name = defaultNotebookObject.name;
        const sectionName = defaultNotebook.section.name;
        const pageName = defaultNotebook.page.name;
        const defaultPath = `${name} - ${sectionName} - ${pageName}`;

        notebookTypes.push({
            cssClass: menuItemOptions.default.cssClass,
            name: `${menuItemOptions.default.name} ${defaultPath}`,
            onItemClicked: menuItemOptions.default.onItemClicked
        });
    }

    notebookTypes.push({
        cssClass: menuItemOptions.snapshot.cssClass,
        name: menuItemOptions.snapshot.name,
        onItemClicked: menuItemOptions.snapshot.onItemClicked
    });

    return notebookTypes;
}
