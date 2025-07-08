import { Candidate } from "../../models/candidate.model";

type AgeFilterFn = (age: number) => boolean;
const ageFilterMap: Record<string, AgeFilterFn> = {
  all: () => true,
  "20-25": (age) => age >= 20 && age <= 25,
  "26-30": (age) => age >= 26 && age <= 30,
  "31-35": (age) => age >= 31 && age <= 35,
  "36-40": (age) => age >= 36 && age <= 40,
  "40+": (age) => age > 40,
};

export function matchesAgeFilter(age: number, filter: string): boolean {
  return (ageFilterMap[filter] || ageFilterMap["all"])(age);
}

type DateFilterFn = (diffDays: number) => boolean;
const dateFilterMap: Record<string, DateFilterFn> = {
  all: () => true,
  "last-week": (d) => d <= 7,
  "last-month": (d) => d <= 30,
  "last-3-months": (d) => d <= 90,
  older: (d) => d > 90,
};

export function matchesDateFilter(dateString: string, filter: string): boolean {
  if (filter === "all") return true;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (dateFilterMap[filter] || dateFilterMap["all"])(diffDays);
}

type SortFn = (a: Candidate, b: Candidate) => number;
const sortMap: Record<string, SortFn> = {
  name: (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  date: (a, b) =>
    new Date(b.applicationDate).getTime() -
    new Date(a.applicationDate).getTime(),
  "date-desc": (a, b) =>
    new Date(a.applicationDate).getTime() -
    new Date(b.applicationDate).getTime(),
  age: (a, b) => a.age - b.age,
  "age-desc": (a, b) => b.age - a.age,
};

export function matchesSearch(candidate: Candidate, search: string): boolean {
  if (!search) return true;
  return (
    candidate.name.toLowerCase().includes(search) ||
    candidate.email.toLowerCase().includes(search) ||
    candidate.city.toLowerCase().includes(search)
  );
}

export function matchesCity(candidate: Candidate, city: string): boolean {
  if (city === "all") return true;
  return candidate.city.toLowerCase().replace(" ", "-") === city;
}

export function sortCandidates(
  candidates: Candidate[],
  sortBy: string
): Candidate[] {
  const sorted = [...candidates];
  const sortFn = sortMap[sortBy] || sortMap["name"];
  return sorted.sort(sortFn);
}
