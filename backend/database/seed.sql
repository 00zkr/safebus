INSERT INTO buses (id, name, driver_name, driver_username, driver_password_hash, status, current_lat, current_lng)
VALUES
  (1, 'Bab Doukkala', 'Ahmed Ait Lahcen', 'driver', '$2b$10$DzdlcpVlkczGE/KXvG1uo.x9RDM9xY4DjPhdwBwZau6q2kQJJbESW', 'idle', 31.1352, -7.9188),
  (2, 'Mhammid Z', 'Youssef El Amrani', 'mhammid-driver', '$2b$10$zLkpt4Mh4CfUeozk028pYe4T47ymCA4eo.DFLb91D.ag/cVpXxJhS', 'delayed', 31.2510, -7.9840),
  (3, 'Nakhil 1', 'Samira Bennis', 'nakhil-driver', '$2b$10$euFUHyGUA/3csCpfNzrDF.LCnGutF7eZHYaLvZ6ulAMh6oIzQMTUm', 'idle', 31.3565, -7.9469),
  (4, 'Ait Ourrir H', 'Hassan Ait Omar', 'aitourrir-driver', '$2b$10$TRXEEay9fyyOChSBkmPKoOs/wttEzPOI.xqLngfNjcZmKd9g.ilAy', 'idle', 31.2061, -7.8608);

INSERT INTO routes (id, name, stops, start_time, end_time, bus_id)
VALUES
  (1, 'Ait Ourrir', JSON_ARRAY('Toubkal IT Center', 'Ait Ourrir', 'Hassan home'), '07:00:00', '08:05:00', 4),
  (2, 'Nakhil', JSON_ARRAY('Toubkal IT Center', 'Massira 2', 'Abwab Guiliz', 'Targa', 'Daouidiat', 'Nakhil'), '06:55:00', '08:20:00', 3),
  (3, 'Mhammid 9', JSON_ARRAY('Toubkal IT Center', 'Douar Laasker', 'Azli', 'Mhammid 5', 'Mhammid 9', 'Mhammid 7'), '07:15:00', '08:20:00', 2),
  (4, 'Bab Doukkala', JSON_ARRAY('Toubkal IT Center', 'Massira 1', 'Ain Mezouar', 'Gueliz', 'Bab Doukkala'), '19:05:00', '20:20:00', 1);

INSERT INTO students (id, full_name, parent_phone, parent_username, parent_password_hash, bus_id, route_id)
VALUES
  (1, 'zkrye', '+212688917804', 'parent', '$2b$10$sbFod2OG0jFqrhImIRljaO3JIvC/QzbZ1xwPBxybLuPVE95hQt.bK', 2, 3),
  (2, 'Hassan Agouram', '+212623761982', 'hassan-parent', '$2b$10$sEQKUnFdOMMWdAZWnQXgsOot9OZBY2uBbBySFOMhLHJtSy0TdN9O2', 4, 1),
  (3, 'Lina Akrou', '+212697216002', 'lina-parent', '$2b$10$ZO.Vp0TEDJpxAWpKqRwIHuwvAQVaUv/rLjL.dxVCAKAs75rnNs7.O', 2, 3),
  (4, 'Merouane ezzeraydi', '+212634092213', 'merouane-parent', '$2b$10$2RnSKAZICP4A6XJC9O1Y..ETtEcTvf3C8OtOsTlySMS051MkgHpla', 1, 4),
  (6, 'Rayan Fihri', '+212623981577', 'rayan-parent', '$2b$10$n4909TrWkzjpwu3BWRilF.sI3dSC7nIWlTOQ2Kochuqw0..yBLBBe', 3, 2),
  (7, 'Yahya Achki', '+212621698123', 'yahya-parent', '$2b$10$O5jgT66i.CgmXRk.Iqr17eEXQ47l2NMt8Vhf9zZM6rNMX3D8dKtRu', 4, 4),
  (8, 'Imrane Farzouz', '+212600100008', 'imrane-parent', '$2b$10$413jbrwvs86BRKG7zcdqU.mINGnyaVpZBVcQfs10lSM60VVfVBXOC', 2, 3);

INSERT INTO parent_notifications (id, student_id, type, message)
VALUES
  (1, 1, 'departure', 'Mhammid Z departed from Toubkal IT Center on the Mhammid 9 route.'),
  (2, 2, 'near_stop', 'Ait Ourrir H is near Ait Ourrir. Please be ready.'),
  (3, 3, 'delay', 'Mhammid Z is delayed near Azli by about 10 minutes.'),
  (4, 4, 'near_stop', 'Bab Doukkala is near Gueliz. Please be ready.'),
  (5, 6, 'departure', 'Nakhil 1 departed from Toubkal IT Center on the Nakhil route.'),
  (6, 7, 'arrival', 'Ait Ourrir H completed the Ait Ourrir route.'),
  (7, 8, 'delay', 'Mhammid Z is delayed near Mhammid 5 by about 5 minutes.');

ALTER TABLE buses AUTO_INCREMENT = 5;
ALTER TABLE routes AUTO_INCREMENT = 5;
ALTER TABLE students AUTO_INCREMENT = 9;
ALTER TABLE parent_notifications AUTO_INCREMENT = 8;
