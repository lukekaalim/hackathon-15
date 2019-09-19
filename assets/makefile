source_svgs = $(shell find . -name "*.svg")
output_pngs = $(patsubst %.svg, %.png, $(source_svgs))

all: $(output_pngs)

%.png: %.svg
	inkscape -f $< -e=$@ -C

.PHONY: all