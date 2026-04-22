# Main LaTeX file (without .tex extension)
MAIN = report

# Default target
all:
	pdflatex report.tex
	biber report
	pdflatex report.tex
	pdflatex report.tex

# Clean auxiliary files
clean:
	rm -f *.aux *.log *.out *.toc *.bbl *.blg *.bcf *.xml

# Remove everything including PDF
cleanall:
	rm -f *.aux *.log *.out *.toc *.bbl *.blg *.bcf *.xml *.pdf
