<?php

namespace App\Services\Ai;

use PhpOffice\PhpWord\Element\AbstractContainer;
use PhpOffice\PhpWord\Element\ListItemRun;
use PhpOffice\PhpWord\Element\Table;
use PhpOffice\PhpWord\Element\Row;
use PhpOffice\PhpWord\Element\Cell;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Element\TextRun;
use PhpOffice\PhpWord\IOFactory;
use RuntimeException;

class WordTextExtractor
{
    public function extract(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        if (! in_array($extension, ['doc', 'docx'], true)) {
            throw new RuntimeException("Unsupported Word file type: {$extension}");
        }

        if (! is_file($path)) {
            throw new RuntimeException("File not found: {$path}");
        }

        $phpWord = IOFactory::load($path);
        $text = [];

        foreach ($phpWord->getSections() as $section) {
            foreach ($section->getElements() as $element) {
                $this->extractFromElement($element, $text);
            }
        }

        $text = array_values(array_filter(array_map(
            fn($line) => trim((string) $line),
            $text
        )));

        return trim(implode("\n", $text));
    }

    protected function extractFromElement(mixed $element, array &$text): void
    {
        if ($element instanceof Text) {
            $value = trim((string) $element->getText());

            if ($value !== '') {
                $text[] = $value;
            }

            return;
        }

        if ($element instanceof TextRun || $element instanceof ListItemRun || $element instanceof AbstractContainer) {
            foreach ($element->getElements() as $child) {
                $this->extractFromElement($child, $text);
            }

            return;
        }

        if ($element instanceof Table) {
            foreach ($element->getRows() as $row) {
                $this->extractFromElement($row, $text);
            }

            return;
        }

        if ($element instanceof Row) {
            foreach ($element->getCells() as $cell) {
                $this->extractFromElement($cell, $text);
            }

            return;
        }

        if ($element instanceof Cell) {
            foreach ($element->getElements() as $child) {
                $this->extractFromElement($child, $text);
            }
        }
    }
}
