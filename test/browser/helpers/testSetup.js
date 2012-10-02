function testSetUp(G) {
    'use strict';

    this.gitjs = new G();
    this.server = this.useFakeServer();
}