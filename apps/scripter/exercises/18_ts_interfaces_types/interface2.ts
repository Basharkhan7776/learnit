// interface2.ts
// TODO: Define Employee, Leader, and Manager interfaces
interface Employee {
  readonly id: string;
  name: string;
  department?: string;
}

interface Leader {
  teamSize: number;
}

// TODO: Manager extending both Employee and Leader
interface Manager extends Employee, Leader {
  reports: Employee[];
  promote(employee: Employee): void;
}

function createManager(id: string, name: string, teamSize: number): Manager {
  const reports: Employee[] = [];
  return {
    id,
    name,
    teamSize,
    reports,
    promote(emp: Employee) {
      reports.push(emp);
    }
  };
}

test("implements multiple interface inheritance and contracts", () => {
  const mgr = createManager("m1", "Sarah Connor", 5);
  expect(mgr.id).toBe("m1");
  expect(mgr.name).toBe("Sarah Connor");
  expect(mgr.teamSize).toBe(5);

  const dev: Employee = { id: "e1", name: "John Doe" };
  mgr.promote(dev);
  expect(mgr.reports).toHaveLength(1);
  expect(mgr.reports[0].name).toBe("John Doe");
});
