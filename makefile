# Main LaTeX file (without .tex extension)
MAIN = report

# Default target
all:
	pdflatex $(MAIN).tex
	pdflatex $(MAIN).tex

# Clean auxiliary files
clean:
	rm -f *.aux *.log *.out *.toc *.bbl *.blg

# Remove everything including PDF
cleanall:
	rm -f *.aux *.log *.out *.toc *.bbl *.blg *.pdf
