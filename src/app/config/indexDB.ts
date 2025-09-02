// indexeddb.service.ts
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class IndexedDbService {
    private dbName = 'EmployeeDB';
    private dbVersion = 1;
    private db!: IDBDatabase;

    private dbReady: Promise<IDBDatabase>;

    constructor() {
        this.dbReady = this.initDB(); // ensure it's a Promise
    }

    private initDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                console.error('Error opening IndexedDB:', event);
                reject(event);
            };

            request.onsuccess = (event: any) => {
                this.db = event.target.result;
                console.log('IndexedDB initialized ✅');
                resolve(this.db);
            };

            request.onupgradeneeded = (event: any) => {
                this.db = event.target.result;

                if (!this.db.objectStoreNames.contains('employees')) {
                    const store = this.db.createObjectStore('employees', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('name', 'name', { unique: false });
                    store.createIndex('role', 'role', { unique: false });
                }
            };
        });
    }

    async addEmployee(employee: { name: string; role: string; fromDate: string; toDate: string }) {
        const db = await this.dbReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction('employees', 'readwrite');
            const store = tx.objectStore('employees');
            const request = store.add(employee);

            request.onsuccess = () => resolve(true);
            request.onerror = (err) => reject(err);
        });
    }

    async getAllEmployees(): Promise<any[]> {
        const db = await this.dbReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction('employees', 'readonly');
            const store = tx.objectStore('employees');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (err) => reject(err);
        });
    }

    async getEmployeeById(id: number | string): Promise<any> {
        const db = await this.dbReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction('employees', 'readonly');
            const store = tx.objectStore('employees');
            const request = store.get(id);  // 👈 fetch single record by key

            request.onsuccess = () => resolve(request.result);
            request.onerror = (err) => reject(err);
        });
    }


    async deleteEmployeeById(id: number | string): Promise<boolean> {
        const db = await this.dbReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction('employees', 'readwrite');
            const store = tx.objectStore('employees');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };
            request.onerror = (err) => reject(err);
        });
    }


    async updateEmployee(employee: { id: number; name: string; role: string; fromDate: string; toDate: string }): Promise<boolean> {
        const db = await this.dbReady;
        return new Promise((resolve, reject) => {
            const tx = db.transaction('employees', 'readwrite');
            const store = tx.objectStore('employees');
            const request = store.put(employee); 
            request.onsuccess = () => {
                resolve(true);
            };
            request.onerror = (err) => reject(err);
        });
    }

}
