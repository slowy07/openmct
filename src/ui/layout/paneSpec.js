/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2021, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

import {
    createOpenMct,
    resetApplicationState,
    waitForRouter
} from 'utils/testing';

describe("the pane", () => {
    let openmct;
    let appHolder;

    beforeEach((done) => {
        openmct = createOpenMct();

        appHolder = document.createElement('div');
        appHolder.style.width = '640px';
        appHolder.style.height = '480px';

        openmct = createOpenMct();
        openmct.install(openmct.plugins.LocalTimeSystem());
        openmct.install(openmct.plugins.UTCTimeSystem());

        openmct.on('start', waitForRouter(done, validateHash));
        openmct.start(appHolder);

        document.body.append(appHolder);
    });

    afterEach(() => {
        return resetApplicationState(openmct);
    });

    it('toggling tree will toggle tree hide params', () => {
        document.querySelector('.l-shell__pane-tree .l-pane__collapse-button').click();
        expect(openmct.router.getSearchParam('hideTree')).toBe('true');
    });

    it('toggling inspector will toggle inspector hide params', (done) => {
        document.querySelector('.l-shell__pane-inspector .l-pane__collapse-button').click();
        setTimeout(() => {
            expect(openmct.router.getSearchParam('hideInspector')).toBe('true');
            done();
        }, 350);
    });

    it('tree pane collapses when adding hide tree param in URL', () => {
        openmct.router.setSearchParam('hideTree', 'true');
        expect(document.querySelector('.l-shell__pane-tree.l-pane--collapsed')).toBeDefined();
    });

    it('inspector pane collapses when adding hide inspector param in URL', () => {
        openmct.router.setSearchParam('hideInspector', 'true');
        expect(document.querySelector('.l-shell__pane-inspector.l-pane--collapsed')).toBeDefined();
    });
});

function validateHash(timeSystemKey, start, end) {
    const hash = window.location.hash;

    return hash.split('=').length === 5
        && hash.includes(`tc.timeSystem=${timeSystemKey}`)
        && hash.includes(`tc.startBound=${start}`)
        && hash.includes(`tc.endBound=${end}`)
        && hash.includes(`tc.mode=fixed`)
    ;
}
