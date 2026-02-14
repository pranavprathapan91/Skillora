"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CoverLetterData } from "@/types/cover-letter";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  paragraph: {
    marginBottom: 12,
  },
});

interface CoverLetterPdfDocumentProps {
  data: CoverLetterData;
}

export function CoverLetterPdfDocument({ data }: CoverLetterPdfDocumentProps) {
  const paragraphs = data.content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {paragraphs.map((para, i) => (
            <Text key={i} style={styles.paragraph}>
              {para}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
