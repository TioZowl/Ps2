CREATE DATABASE  IF NOT EXISTS `ps2` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `ps2`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ps2
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Cañas'),(2,'Accesorios'),(3,'Reels'),(4,'Señuelos/Ansuelos');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `stock` int(10) unsigned NOT NULL DEFAULT 0,
  `id_categoria` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_productos_categoria` (`id_categoria`),
  CONSTRAINT `fk_productos_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (4,'Señuelo angler popper 90','Tipo: Superficie\nLargo: 90 mm\nPeso: 12 gr\nAcción: Popper (explosiones y salpicaduras en superficie)\nRattlin (efecto sonoro): Sí (sonido por impacto + micro cámara interna)\nGanchos: Anzuelos triples\nIdeal para: Dorado, Tararira y otros peces depredadores',280.00,'upload/señuelo_1.webp',55,4),(5,'Señuelo kawana sh 60','El Kawana SH60 Crank es un señuelo versátil de media agua, ideal para la pesca de depredadores como la tararira y el pacú.\nModelo - SH 60\n\nTamaño - 6cm\nPeso - 8.5grs\nAccion - media agua \nRattling - no ',279.00,'upload/señuelo_2.webp',30,4),(6,'Anzuelo kaiju rojo -Blister','Anzuelo de pesca Kaiju H16401 en color rojo con la punta de acero inoxidable Super resistente Ideal para señuelos .\n\n\nBlister x 10 unidades \n\n \n\nTamaños - Nº 1 - 1/0 - 2/0 - 3/0',640.00,'upload/ansuelo_1.webp',120,4),(7,'Caña angler phoenix Frontal','Caña para Surfcasting en Carbono de Alto Grado\nCasting weight 100 - 300grs\nTres Tramos\nPuntero y Pasahilos de SIC\nFunda de Tela\nMedidas - 3.90mts \n               4.20mts',5500.00,'upload/caña_1.webp',20,1),(8,'Caña challenger x force','Ideal para pesca de embarque\nAcción: Heavy\nMedida: 2.10 m\nTramos: 2\nPasa hilos de cerámica\nSólida\nMango en eva para un cómodo agarre sin desliz.\nMedidas - 1-80mts \n               2.10mts',700.00,'upload/caña_2.webp',10,1),(9,'Caña kawana C 601MH 1.83MTS','Pasahilos y puntero en acero inoxidable ,super ligeros y duraderos \nCuerpo tubular en fibra de vidrio ,robusto y resistente\nPortareel con gatillo \nMango en goma eva \nTramos: 1 Tramo\nLibraje: 10-20lb\nLargo: 1.83mt',1150.00,'upload/caña_3.webp',14,1),(10,'Reel rotativo Maruri black pira 400','Potencia de carrete y tecnología para grandes desafíos.\nDesarrollado para afrontar los mayores retos de la pesca, el BLACK PIRA 400 hace honor a su nombre, estando diseñado para capturar grandes especies. Con buena capacidad de línea y una resistencia extremadamente fuerte, también es ideal para la pesca de peces en ríos asi como tambien en el mar .\n',5100.00,'upload/reel_1.webp',8,3),(11,'Reel frontal HB 7000','1 ruleman\nSistema balanceado\nRecuperación 5.2:1\nCapacidad con 0.50 mm – 100 mts\nDrag max 20kg\nPeso 318GRS',1600.00,'upload/reel_2.webp',23,3),(12,'Reel rotativo abu 5600c4','4 rulemanes de acero inoxidable + 1 ruleman de rodillos\nSistema de freno Carbon Matrix™\nManija y estrella compactas\nFreno centrífugo de 6 pines\nSistema de viento nivelado sincronizado\nCapacidad mono 0.32mm - 220mts\nCapacidad Multi  0.36mm - 215mts\nRelacion de recuperacion 6.3-1\nDrag max: 6.8 kg\nReel para diestro\nPeso 285grs',15000.00,'upload/reel_3.webp',7,3),(13,'Posacaña aluminio +mesa para carnada','Largo - 1.20mts \nMaterial del posacaña, aluminio y plastico \nMaterial de la mesa, plastico lo que la hace \nmas sencilla para su limpieza .',125.00,'upload/posacaña_1.webp',1390,2),(14,'Caja plano clasica 3 bandeja',' 3 bandejas\n Divisiones ajustables que permite de 22 a 34 divisiones\n 2 compartimientos en la parte superior\n Seguro con arillo de metal\n 2 Entradas para candado\n Medidas: 41.28 cm (16.25”) largo x 22.86 cm (9”) ancho x 21.27 cm (8.375”) alto',2500.00,'upload/balija_1.webp',20,2),(15,' Multifilamento thor mustad x110mts','Hecho de fibras Spectra de muy alta resistencia. Un exclusivo proceso de trenzado NR de 4 hilos le da a las líneas trenzadas Mustad Thor un perfil delgado, redondo y suave. Esto hace que sea más suave y silencioso en las guías. Conseguirás lances más largos y un manejo más fácil en el carrete. El revestimiento patentado DuPont proporciona una excelente resistencia a la abrasión, manteniendo al mismo tiempo su resistencia y durabilidad superiores. \nMedidas 0.22mm - resiste 18.2kg\n             0.28mm - resiste 20.5kg\n             0.32mm - resiste 22.8kg ',1000.00,'upload/multi_1.webp',500,2);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('usuario','admin') NOT NULL DEFAULT 'usuario',
  `foto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Aldo','aldo@tienda.com','$2b$10$vaf5nqTpaDlfcAG6Tx6GfORQ3aRgQV3r9U2R05wXIhGZ5KUH5kut2','admin',NULL),(3,'Mathias','mathias@tienda.com','$2b$10$MPXZ3Oybv9l.sOh5VqHzwOvF4uKe1e3hFFutsL3.phdmwFQL3s5hu','admin',NULL),(4,'prueba','prueba@tienda.com','$2b$10$CNmNHl0ZDAX.p12QjEf8UuCl6IHBiqe7TqbGuc9kbO.jwXNNlKQ3a','usuario',NULL),(5,'prueba2','prueba2@tienda.com','$2b$10$3f3aEu6w1yIU1v5pxp3BeOO8AjO7Iq8PPNckb0tAZ2DCnEnWBnVWW','usuario',NULL),(6,'prueba3','prueba3@tienda.com','$2b$10$xVU1YP9.b9Gg.L5itT9/HOO7bo1RdAEVFh4jh/5urgbEe6bvetM/C','usuario',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-12 19:19:35
