"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  name: {
    fontSize: 22,
    marginBottom: 4,
  },
  contact: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0284c7",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 1.4,
  },
  jobTitle: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  meta: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 4,
  },
  bullet: {
    marginBottom: 4,
    paddingLeft: 12,
    lineHeight: 1.4,
  },
  skills: {
    lineHeight: 1.5,
  },
});

interface ResumePdfDocumentProps {
  data: ResumeData;
}

export function ResumePdfDocument({ data }: ResumePdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.name}>{data.name || "Your Name"}</Text>
          <Text style={styles.contact}>
            {[data.email, data.phone, data.location].filter(Boolean).join(" · ")}
          </Text>
        </View>

        {data.summary ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.paragraph}>{data.summary}</Text>
          </View>
        ) : null}

        {data.experience.length > 0 ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={{ marginBottom: 10 }}>
                <Text style={styles.jobTitle}>{e.jobTitle}</Text>
                <Text style={styles.meta}>
                  {e.company}
                  {e.location ? ` · ${e.location}` : ""} · {e.startDate} – {e.endDate}
                </Text>
                {e.description ? (
                  <Text style={styles.paragraph}>{e.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {data.education.length > 0 ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <Text style={styles.jobTitle}>{edu.degree}</Text>
                <Text style={styles.meta}>
                  {edu.school}
                  {edu.location ? ` · ${edu.location}` : ""} · {edu.startDate} – {edu.endDate}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.skills.filter(Boolean).length > 0 ? (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>
              {data.skills.filter(Boolean).join(", ")}
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
