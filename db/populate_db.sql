BEGIN;

INSERT INTO Presets VALUES(NULL, 'Save 1', date('now'), 2);
INSERT INTO States VALUES(NULL, 'Save 1', 2.5, 1, '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');
INSERT INTO States VALUES(NULL, 'Save 1', 2.5, 1, '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', '#00F', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');

INSERT INTO Presets VALUES(NULL, 'Save 2', date('now'), 2);
INSERT INTO States VALUES(NULL, 'Save 2', 2.5, 1, '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');
INSERT INTO States VALUES(NULL, 'Save 2', 2.5, 1, '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', '#fff', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');

INSERT INTO Presets VALUES(NULL, 'Save 3', date('now'), 2);
INSERT INTO States VALUES(NULL, 'Save 3', 2.5, 1, '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');
INSERT INTO States VALUES(NULL, 'Save 3', 2.5, 1, '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', '#F00', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');

INSERT INTO Presets VALUES(NULL, 'Save 4', date('now'), 2);
INSERT INTO States VALUES(NULL, 'Save 4', 2.5, 1, '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');
INSERT INTO States VALUES(NULL, 'Save 4', 2.5, 1, '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', '#0F0', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');

INSERT INTO Presets VALUES(NULL, 'Save 5', date('now'), 2);
INSERT INTO States VALUES(NULL, 'Save 5', 2.5, 1, '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');
INSERT INTO States VALUES(NULL, 'Save 5', 2.5, 1, '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', '#000', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A');

COMMIT;
