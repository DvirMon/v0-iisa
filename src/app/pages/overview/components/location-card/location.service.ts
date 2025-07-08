// geocoding.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private readonly API_URL = 'https://api.opencagedata.com/geocode/v1/json';
  private readonly API_KEY = 'be345afe3c6c42afb33bd71a1a12a01e'; // 🔐 Replace with your real key

  constructor(private http: HttpClient) {}

  fetchCoordinates(city: string): Observable<{ lat: number; lng: number; formatted: string } | null> {
    const params = {
      q: city,
      key: this.API_KEY,
      limit: '1',
      language: 'en',
    };

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map((response) => {
        const result = response.results?.[0];
        return result
          ? {
              lat: result.geometry.lat,
              lng: result.geometry.lng,
              formatted: result.formatted,
            }
          : null;
      })
    );
  }
}
