import { Injectable, signal, computed } from "@angular/core";
import {
  Candidate,
  ChartData,
  LocationData,
  VisitData,
} from "../models/candidate.model";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  // Signal for candidates data
  private candidatesSignal = signal<Candidate[]>(this.getMockCandidates());

  // Public readonly signal
  candidates = this.candidatesSignal.asReadonly();

  // Computed signals for derived data
  totalCandidates = computed(() => this.candidates().length);
  approvedCandidates = computed(
    () => this.candidates().filter((c) => c.status === "Approved").length
  );

  private getMockCandidates(): Candidate[] {
    return [
      {
        id: 1,
        name: "Sarah Cohen",
        email: "sarah.cohen@email.com",
        age: 28,
        city: "Tel Aviv",
        image: "https://i.pravatar.cc/150?img=1",
        hobbies: "Astronomy, Rock Climbing, Photography",
        summary:
          "Aerospace engineer with 5 years experience in satellite technology",
        status: "Under Review",
        applicationDate: "2024-01-15",
      },
      {
        id: 2,
        name: "David Levi",
        email: "david.levi@email.com",
        age: 32,
        city: "Jerusalem",
        image: "https://i.pravatar.cc/150?img=2",
        hobbies: "Physics, Marathon Running, Chess",
        summary: "Physicist specializing in zero-gravity research",
        status: "Approved",
        applicationDate: "2024-01-12",
      },
      {
        id: 3,
        name: "Maya Goldberg",
        email: "maya.goldberg@email.com",
        age: 26,
        city: "Haifa",
        image: "https://i.pravatar.cc/150?img=3",
        hobbies: "Piloting, Scuba Diving, Robotics",
        summary: "Commercial pilot with advanced flight training",
        status: "Pending",
        applicationDate: "2024-01-18",
      },
      {
        id: 4,
        name: "Amit Rosenberg",
        email: "amit.rosenberg@email.com",
        age: 35,
        city: "Beer Sheva",
        image: "https://i.pravatar.cc/150?img=4",
        hobbies: "Engineering, Mountain Biking, Cooking",
        summary: "Mechanical engineer with space systems expertise",
        status: "Under Review",
        applicationDate: "2024-01-20",
      },
      {
        id: 5,
        name: "Noa Shapira",
        email: "noa.shapira@email.com",
        age: 29,
        city: "Eilat",
        image: "https://i.pravatar.cc/150?img=5",
        hobbies: "Marine Biology, Yoga, Photography",
        summary: "Biologist researching life in extreme environments",
        status: "Approved",
        applicationDate: "2024-01-14",
      },
      {
        id: 6,
        name: "Yosef Katz",
        email: "yosef.katz@email.com",
        age: 31,
        city: "Netanya",
        image: "https://i.pravatar.cc/150?img=6",
        hobbies: "Software Development, Gaming, Music",
        summary: "Software engineer specializing in mission-critical systems",
        status: "Rejected",
        applicationDate: "2024-01-10",
      },
    ];
  }

  // Static data methods (could also be signals if they change)
  getAgeData(): ChartData[] {
    return [
      { name: "20-25", value: 8 },
      { name: "26-30", value: 15 },
      { name: "31-35", value: 12 },
      { name: "36-40", value: 7 },
      { name: "41+", value: 3 },
    ];
  }

  getLocationData(): LocationData[] {
    return [
      { city: "Tel Aviv", count: 12, lat: 32.0853, lng: 34.7818 },
      { city: "Jerusalem", count: 8, lat: 31.7683, lng: 35.2137 },
      { city: "Haifa", count: 6, lat: 32.794, lng: 34.9896 },
      { city: "Beer Sheva", count: 4, lat: 31.2518, lng: 34.7915 },
      { city: "Eilat", count: 3, lat: 29.5581, lng: 34.9482 },
    ];
  }

  getStatusData(): ChartData[] {
    return [
      { name: "Approved", value: 12, color: "#4caf50" },
      { name: "Under Review", value: 18, color: "#ff9800" },
      { name: "Pending", value: 8, color: "#2196f3" },
      { name: "Rejected", value: 7, color: "#f44336" },
    ];
  }

  getVisitsData(): VisitData[] {
    return [
      { date: "Jan 1", visits: 120, registrations: 15 },
      { date: "Jan 2", visits: 150, registrations: 22 },
      { date: "Jan 3", visits: 180, registrations: 28 },
      { date: "Jan 4", visits: 200, registrations: 35 },
      { date: "Jan 5", visits: 250, registrations: 45 },
      { date: "Jan 6", visits: 300, registrations: 52 },
      { date: "Jan 7", visits: 280, registrations: 48 },
    ];
  }

  getHobbiesData(): ChartData[] {
    return [
      { name: "Astronomy", value: 15 },
      { name: "Sports", value: 12 },
      { name: "Technology", value: 18 },
      { name: "Arts", value: 8 },
      { name: "Science", value: 22 },
      { name: "Adventure", value: 10 },
    ];
  }

  // Method to update candidate status
  updateCandidateStatus(
    candidateId: number,
    status: Candidate["status"]
  ): void {
    const currentCandidates = this.candidatesSignal();
    const updatedCandidates = currentCandidates.map((candidate) =>
      candidate.id === candidateId ? { ...candidate, status } : candidate
    );
    this.candidatesSignal.set(updatedCandidates);
  }

  // Method to add new candidate
  addCandidate(candidate: Omit<Candidate, "id">): void {
    const currentCandidates = this.candidatesSignal();
    const newId = Math.max(...currentCandidates.map((c) => c.id)) + 1;
    const newCandidate: Candidate = { ...candidate, id: newId };
    this.candidatesSignal.update((candidates) => [...candidates, newCandidate]);
  }

  // Method to remove candidate
  removeCandidate(candidateId: number): void {
    this.candidatesSignal.update((candidates) =>
      candidates.filter((c) => c.id !== candidateId)
    );
  }
}
