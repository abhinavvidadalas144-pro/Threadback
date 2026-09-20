# ThreadBack

> **Some memories are enough to find your way home.**

ThreadBack is a prototype AI-powered platform designed to help people reconnect with individuals they have been separated from due to displacement, adoption, migration, or family estrangement.

Instead of requiring users to remember exact names, dates, locations, or records, ThreadBack allows them to describe what they remember in their own words.

The prototype uses AI to structure those fragmented memories and identify potential connections based on similarities in the available information. Potential connections are presented for human review rather than being treated as confirmed identities.

---

## ⚠️ Prototype Notice

**ThreadBack is a demonstration prototype created for a hackathon. It is not a real-world operational missing-person or family-reunification service.**

The current version uses **fictional/synthetic demonstration data** and does not connect to real missing-person databases, government records, NGO databases, or real individuals.

The AI-generated matches shown in the prototype are demonstrations of the proposed workflow and **must not be interpreted as real identity matches or verified connections.**

A real deployment would require extensive validation, privacy protections, security controls, trained human caseworkers, appropriate organizational partnerships, and compliance with applicable laws and safeguarding requirements.

---

## The Problem

When people become separated from family members or people from their past, they may remember only fragments.

For example, someone might remember:

- A person's name, but not the exact spelling
- A village or neighborhood, but not the exact address
- An approximate year or age
- A relationship such as "younger sister" or "childhood neighbor"
- A landmark near where they lived
- A distinctive detail about a person or place
- Several memories that may be incomplete or uncertain

Traditional structured search systems generally work best when information such as names, dates, locations, or identification records is known accurately.

Human memory does not always work that way.

A person may remember:

> "Her name might have been Kamla or Kamala. We lived in a small village near a river around the late 1980s. There was an old temple close to our house."

Searching this information as exact database fields can be difficult.

ThreadBack explores whether AI can help transform these fragmented memories into structured, searchable information while preserving uncertainty.

---

## The Idea

ThreadBack creates a bridge between:

**Human memory → AI-assisted structuring → Meaning-based matching → Human review**

The goal is not for AI to decide that two people are the same.

Instead, AI helps organize information and surface **potential connections** that a human reviewer can investigate further.

---

## How ThreadBack Works

### 1. Describe a Memory

A user can choose between two flows:

- **I'm searching for someone**
- **I have information that might help**

The user then describes what they remember using natural language.

They do not need to know the exact spelling, date, address, or other structured information.

---

### 2. AI Structures the Memory

ThreadBack processes the submitted memory and extracts useful information such as:

- Possible names
- Relationships
- Approximate time periods
- Locations
- Age-related information
- Distinguishing details
- Other relevant memory clues

The system presents a structured summary of what it understood.

The user can review and edit the extracted information before confirming it.

Importantly, uncertain information is not supposed to be presented as confirmed fact.

For example:

- `Possible name: Kamla / Kamala`
- `Approximate period: around 1988`
- `Location clue: village near a river`

This helps preserve the uncertainty that exists in the original memory.

---

### 3. Potential Connections

The prototype compares memory profiles and looks for similarities across available information.

Potential matching signals can include:

- Similar names
- Similar locations
- Similar time periods
- Similar relationships
- Similar distinguishing details
- Other meaningful overlaps between memories

The system produces an **information similarity percentage**.

For example:

**87% Information Similarity**

This percentage represents similarity between the available information.

It **does not mean that the system has verified that two people are the same.**

---

### 4. Human Review

Potential connections are intended to be reviewed by a human moderator.

The moderator can examine:

- The original memory
- Structured profile information
- Potential connections
- Matching signals
- Conflicting or missing information
- Case status
- Moderator notes

The moderator can then take actions such as reviewing, adding notes, flagging, dismissing, or otherwise updating the case according to the prototype workflow.

The purpose of this human-in-the-loop approach is to prevent the AI from being treated as the final authority on someone's identity.

---

## Main Website Sections

### Home

The landing page introduces the problem and explains the ThreadBack concept.

It provides two main entry points:

- **I'm searching for someone**
- **I have information that might help**

It also explains the basic workflow and the project's safety approach.

---

### Submit a Memory

Users can submit a memory using natural language.

The prototype provides guided information fields while still allowing the user to describe memories in their own words.

---

### AI Summary

After submitting a memory, the prototype generates a structured representation of what was understood.

Users can review and edit the extracted information before confirming it.

The purpose of this step is to turn an unstructured memory into information that can be compared more effectively.

---

### Monitored Dashboard

The monitored dashboard represents the human-review side of the system.

It provides an overview of:

- Memory profiles
- Current case/profile status
- Potential connections
- Information similarity
- Relevant matching information
- Review actions

This is designed as a prototype interface for a moderator or caseworker.

---

### Potential Connection

The Potential Connection page provides a more detailed comparison between two memory profiles.

It displays:

- Case reference
- Profile references
- Information similarity
- Profile information
- Original memory narratives
- Matching information
- Relevant supporting details
- Human-review status

The interface is designed to help a reviewer understand **why a potential connection was suggested** rather than simply presenting a percentage.

---

### Safety & About

This section explains the project's purpose, limitations, and human-review approach.

The prototype is designed around the principle that AI should assist with organizing and surfacing information rather than independently making sensitive decisions.

---

## Example Prototype Flow

A simplified example of the prototype workflow is:

```text
User remembers fragments of a person
                ↓
        Submit the memory
                ↓
       AI structures the memory
                ↓
       User reviews the summary
                ↓
     Profile is added to the system
                ↓
     AI compares available profiles
                ↓
       Potential connections
                ↓
      Information similarity
                ↓
         Human moderator
                ↓
     Review / note / flag / dismiss
