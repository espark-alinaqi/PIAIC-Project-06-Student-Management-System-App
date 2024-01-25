import inquirer from 'inquirer';
import { Student, Course, Teacher } from '../classes/classes.js';

let sleep = () => new Promise((r) => setTimeout(r, 1000));

//  Add Course Function
export async function AddCourse(DetailsInputs: (type: string, name: string) => Promise<string | number>, courses: Course[]) {
    const course_name = await DetailsInputs('', "Name") as string;
    const course_timing = await DetailsInputs('', "Timing") as string;
    const course_fee = await DetailsInputs('number', "Fee") as number;

    let course = new Course(course_name, course_timing, course_fee);

    console.log('Adding Course...');
    await sleep();

    courses.push(course);
    console.log('Course Added Successfully');
}

// View Courses Function
export async function ViewCourses(courses: Course[], teachers: Teacher[], students: Student[]) {
    if (!courses.length) {
        console.log('No Course Available');
        return;
    }

    console.table(courses.map((val) => {
        return {
            Name: val.name,
            Timing: val.timing,
            Students: val.students.length ? val.students?.map((student) => student.name).join(', ') : "No Student Enrolled",
            Teacher: val.teacher ? val.teacher.name : "No Teacher Assigned"
        };
    }));

    const input = await inquirer.prompt([{
        name: 'index',
        message: 'Enter Index of Course to see more OPTIONS OR Any key to Exit : ',
        type: 'number'
    }]);
    const index: number = await input['index'];

    if (index <= courses.length - 1 && index >= 0) {
        let course = courses.at(index) as Course;

        const input2 = await inquirer.prompt([{
            name: 'choice',
            message: 'Select One',
            type: 'list',
            choices: ['Add Student', 'Assign Teacher', 'Exit']
        }]);
        let choice = await input2['choice'];

        if (choice === 'Exit') {
            return;
        }

        // Add Student To Course
        if (choice === 'Add Student') {
            const input3 = await inquirer.prompt([{
                name: 'student',
                message: 'Enter RollNo of Student: ',
                type: 'number'
            }]);
            let value: number = await input3['student'];
            let student = students.find((val) => val.studentID === value);

            console.log('Adding Student...');
            await sleep();

            if (!student) {
                console.log('No Student With this Roll No');
                return;
            }

            if (student.courses.includes(course)) {
                console.log('Student Already Enrolled in this Course');
                return;
            }

            if (student.balance < course.fee) {
                console.log("Student Doesn't Have Enough Balance to Pay Fee");
                return;
            }

            course?.registerStudent(student);
            course.addCourseInStudentCourses(student);

            console.log(`Student Added In Course Successfully and RS: ${course.fee} Fee Minus From Student's Balance`);
            return;
        }

        // Assign Teacher To Course
        if (choice === 'Assign Teacher') {
            if (course.teacher) {
                console.log('Teacher Already Assigned to this Course');
                return;
            }

            const input3 = await inquirer.prompt([{

