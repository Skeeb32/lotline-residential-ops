export type Asset = {
  id: string;
  name: string;
  location: string;
  units: number;
  funded: number;
  target: number;
  occupancy: number;
  status: "Operating" | "Launching" | "Review";
  initials: string;
  tone: string;
};

export type Task = {
  id: string;
  title: string;
  detail: string;
  due: string;
  owner: string;
  priority: "High" | "Normal";
  done?: boolean;
};

export const assets: Asset[] = [
  { id: "AST-2048", name: "The Linden", location: "Austin, TX", units: 24, funded: 92, target: 100, occupancy: 96, status: "Operating", initials: "LI", tone: "sage" },
  { id: "AST-2051", name: "Juniper House", location: "Denver, CO", units: 18, funded: 100, target: 100, occupancy: 89, status: "Operating", initials: "JH", tone: "sand" },
  { id: "AST-2057", name: "Parkline Flats", location: "Nashville, TN", units: 32, funded: 68, target: 100, occupancy: 0, status: "Launching", initials: "PF", tone: "blue" },
  { id: "AST-2062", name: "The Marlowe", location: "Charlotte, NC", units: 16, funded: 100, target: 100, occupancy: 94, status: "Review", initials: "MA", tone: "rose" },
];

export const initialTasks: Task[] = [
  { id: "TSK-101", title: "Review title commitment", detail: "Parkline Flats · Acquisition", due: "Today", owner: "AM", priority: "High" },
  { id: "TSK-104", title: "Approve investor update", detail: "The Linden · Communications", due: "Today", owner: "JL", priority: "High" },
  { id: "TSK-108", title: "Reconcile Q3 expenses", detail: "Juniper House · Asset management", due: "Oct 18", owner: "SK", priority: "Normal" },
  { id: "TSK-112", title: "Prepare distribution batch", detail: "The Marlowe · Investor operations", due: "Oct 21", owner: "AM", priority: "Normal" },
];
