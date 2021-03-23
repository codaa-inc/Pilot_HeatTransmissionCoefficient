DROP TABLE IF EXISTS `surfaceHeatResistance`;

CREATE TABLE `surfaceHeatResistance` (
	`id`	number	NOT NULL,
	`outdoor`	varchar	NULL,
	`indoor`	varchar	NULL,
	`partCode`	VARCHAR(255)	NOT NULL
);

DROP TABLE IF EXISTS `Material_ThermalConductivity`;

CREATE TABLE `Material_ThermalConductivity` (
	`id`	number	NOT NULL,
	`material`	varchar	NULL,
	`value`	varchar	NULL
);

DROP TABLE IF EXISTS `HeatTransmissionCoefficient`;

CREATE TABLE `HeatTransmissionCoefficient` (
	`id`	number	NOT NULL,
	`localeCode`	char	NULL,
	`value`	array(8)	NULL,
	`useCode`	number	NOT NULL
);

DROP TABLE IF EXISTS `MeanHeatTransmissionCoefficient`;

CREATE TABLE `MeanHeatTransmissionCoefficient` (
	`id`	number	NOT NULL,
	`point`	number	NULL,
	`value`	array(3)	NULL,
	`localeCode`	number	NOT NULL
);

DROP TABLE IF EXISTS `Window_ThermalConductivity`;

CREATE TABLE `Window_ThermalConductivity` (
	`id`	number	NOT NULL,
	`window`	varchar	NULL,
	`value`	number	NULL
);

DROP TABLE IF EXISTS `UseCode`;

CREATE TABLE `UseCode` (
	`useCode`	number	NOT NULL,
	`use`	varchar	NULL
);

DROP TABLE IF EXISTS `LocaleCode`;

CREATE TABLE `LocaleCode` (
	`localeCode`	number	NOT NULL,
	`locale`	varchar	NULL
);

DROP TABLE IF EXISTS `PartCode`;

CREATE TABLE `PartCode` (
	`partCode`	VARCHAR(255)	NOT NULL,
	`part`	VARCHAR(255)	NULL
);

DROP TABLE IF EXISTS `concreteThermalConductivity`;

CREATE TABLE `concreteThermalConductivity` (
	`id`	number	NOT NULL,
	`concrete`	varchar	NULL,
	`value`	number	NULL
);

DROP TABLE IF EXISTS `externalMaterialThermalConductivity`;

CREATE TABLE `externalMaterialThermalConductivity` (
	`id`	number	NOT NULL,
	`exmaterial`	varchar	NULL,
	`value`	number	NULL
);

DROP TABLE IF EXISTS `slabHeatResistance`;

CREATE TABLE `slabHeatResistance` (
	`id`	number	NOT NULL,
	`direct`	number	NULL,
	`indirect`	number	NULL,
	`localeCode`	number	NOT NULL
);

ALTER TABLE `surfaceHeatResistance` ADD CONSTRAINT `PK_SURFACEHEATRESISTANCE` PRIMARY KEY (
	`id`
);

ALTER TABLE `Material_ThermalConductivity` ADD CONSTRAINT `PK_MATERIAL_THERMALCONDUCTIVITY` PRIMARY KEY (
	`id`
);

ALTER TABLE `HeatTransmissionCoefficient` ADD CONSTRAINT `PK_HEATTRANSMISSIONCOEFFICIENT` PRIMARY KEY (
	`id`
);

ALTER TABLE `MeanHeatTransmissionCoefficient` ADD CONSTRAINT `PK_MEANHEATTRANSMISSIONCOEFFICIENT` PRIMARY KEY (
	`id`
);

ALTER TABLE `Window_ThermalConductivity` ADD CONSTRAINT `PK_WINDOW_THERMALCONDUCTIVITY` PRIMARY KEY (
	`id`
);

ALTER TABLE `UseCode` ADD CONSTRAINT `PK_USECODE` PRIMARY KEY (
	`useCode`
);

ALTER TABLE `LocaleCode` ADD CONSTRAINT `PK_LOCALECODE` PRIMARY KEY (
	`localeCode`
);

ALTER TABLE `PartCode` ADD CONSTRAINT `PK_PARTCODE` PRIMARY KEY (
	`partCode`
);

ALTER TABLE `concreteThermalConductivity` ADD CONSTRAINT `PK_CONCRETETHERMALCONDUCTIVITY` PRIMARY KEY (
	`id`
);

ALTER TABLE `externalMaterialThermalConductivity` ADD CONSTRAINT `PK_EXTERNALMATERIALTHERMALCONDUCTIVITY` PRIMARY KEY (
	`id`
);

ALTER TABLE `slabHeatResistance` ADD CONSTRAINT `PK_SLABHEATRESISTANCE` PRIMARY KEY (
	`id`
);

ALTER TABLE `surfaceHeatResistance` ADD CONSTRAINT `FK_PartCode_TO_surfaceHeatResistance_1` FOREIGN KEY (
	`partCode`
)
REFERENCES `PartCode` (
	`partCode`
);

ALTER TABLE `HeatTransmissionCoefficient` ADD CONSTRAINT `FK_UseCode_TO_HeatTransmissionCoefficient_1` FOREIGN KEY (
	`useCode`
)
REFERENCES `UseCode` (
	`useCode`
);

ALTER TABLE `MeanHeatTransmissionCoefficient` ADD CONSTRAINT `FK_LocaleCode_TO_MeanHeatTransmissionCoefficient_1` FOREIGN KEY (
	`localeCode`
)
REFERENCES `LocaleCode` (
	`localeCode`
);

ALTER TABLE `slabHeatResistance` ADD CONSTRAINT `FK_LocaleCode_TO_slabHeatResistance_1` FOREIGN KEY (
	`localeCode`
)
REFERENCES `LocaleCode` (
	`localeCode`
);

