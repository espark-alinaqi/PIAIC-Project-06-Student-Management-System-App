import inquirer from 'inquirer';
import { Student, Course } from '../classes/classes.js';

let sleep = () => new Promise((r) => setTimeout(r, 1000));

// Add Student Function
export async function AddStudent(DetailsInputs: (type: string, name: string) => Promise<string | number>, students: Student[]) {
    const name = await DetailsInputs('', 'Name') as string;
    const age = await DetailsInputs('number', 'Age') as number;

    let student = new Student(name, age);

    console.log('Adding Student...');
    await sleep();

    students.push(student);
    console.log('Student Added Successfully');
}

// View Students Function
export async function ViewStudents(students: Student[], courses: Course[]) {
    if (!students.length) {
        console.log('No Student Available');
        return;
    }

    console.table(students.map((val) => {
        return {
            studentID: val.studentID,
            Name: val.name,
            Age: val.age,
            Courses: val.courses.length ? val.courses.map((course) => course.name).join(',') : "Not Enrolled",
            Balance: `RS: ${val.balance}`
        };
    }));

    const input = await inquirer.prompt([{
        name: 'index',
        message: 'Enter Index to Register In Course OR Any key to Exit : ',
        type: 'number'
    }]);

    const index: number = await input['index'];

    if (index <= students.length - 1 && index >= 0) {
        if (!courses.length) {
            console.log('No Course Available');
            return;
        }

        const input = await inquirer.prompt([{
            name: 'course',
            message: 'Select Course: ',
            type: 'list',
            choices: courses.map((val) => { return { name: `${val.name} (Fee: RS ${val.fee})`, value: val.id } })
        }]);

        let course_id: number = await input['course'];
        let course = courses.filter((val) => val.id === course_id)[0];
        let student = students.at(index) as Student;

        console.log('Registering...');
        await sleep();

        if (student?.courses.includes(course)) {
            console.log('Student Already Enrolled in this Course');
            return;
        }

        if (student?.balance < course.fee) {
            console.log("You Don't Have Enough Balance to Pay Fee");
            return;
        }

        student?.registerInCourse(course);
        student?.addStudentInCourseStudents(course);

        console.log(`Registered In Course Successfully and RS: ${course.fee} Fee Minus From Your Balance`);
    }
}
