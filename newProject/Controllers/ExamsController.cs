using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Packaging;
using newProject.Models;


namespace newProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExamsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Exam>>> GetExams()
        {
            var exams = await _context.Exams
                .Include(e => e.QuestionsNavigation)
                .ThenInclude(q => q.AnswersNavigation)
                .Include(e => e.GradesNavigation)
                .ToListAsync();

            if (exams == null || exams.Count == 0)
            {
                return NotFound();
            }

            return exams;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Exam>> GetExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.QuestionsNavigation)
                .ThenInclude(q => q.AnswersNavigation)
                .Include(e => e.GradesNavigation) 
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound();
            }

            return exam;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExam(int id, Exam exam)
        {
            if (id != exam.Id)
            {
                return BadRequest();
            }

            var existingExam = await _context.Exams
                .Include(e => e.QuestionsNavigation)
                .ThenInclude(q => q.AnswersNavigation)
                .Include(e => e.GradesNavigation)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (existingExam == null)
            {
                return NotFound();
            }

            existingExam.Name = exam.Name; 

            foreach (var newQuestion in exam.QuestionsNavigation)
            {
                var existingQuestion = existingExam.QuestionsNavigation.FirstOrDefault(q => q.Id == newQuestion.Id);

                if (existingQuestion == null)
                {
                    existingExam.QuestionsNavigation.Add(newQuestion);
                }
                else
                {
                    existingQuestion.QuestionText = newQuestion.QuestionText; 

                    foreach (var newAnswer in newQuestion.AnswersNavigation)
                    {
                        var existingAnswer = existingQuestion.AnswersNavigation.FirstOrDefault(a => a.Id == newAnswer.Id);

                        if (existingAnswer == null)
                        {
                            existingQuestion.AnswersNavigation.Add(newAnswer);
                        }
                        else
                        {
                            existingAnswer.AnswerText = newAnswer.AnswerText; 
                        }
                    }
                }
            }

            //existingExam.GradesNavigation = exam.GradesNavigation;
            //if (exam.GradesNavigation != null && exam.GradesNavigation.Any())
            //{

            //    existingExam.GradesNavigation.AddRange(exam.GradesNavigation);
            //}
            foreach (var newGrade in exam.GradesNavigation)
            {
                var existingGrade = existingExam.GradesNavigation.FirstOrDefault(g => g.Id == newGrade.Id);

                if (existingGrade == null)
                {
                    existingExam.GradesNavigation.Add(newGrade);
                }
                else
                {
                    existingGrade.GradeExam = newGrade.GradeExam;
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Exam>> PostExam(Exam exam)
        {
            if (_context.Exams == null)
            {
                return Problem("Entity set 'AppDbContext.Exams' is null.");
            }

            _context.Exams.Add(exam);

            foreach (var question in exam.QuestionsNavigation)
            {
                _context.Questions.Add(question);

                foreach (var answer in question.AnswersNavigation)
                {
                    _context.Answers.Add(answer);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ExamExists(exam.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetExam", new { id = exam.Id }, exam);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            if (_context.Exams == null)
            {
                return NotFound();
            }

            var exam = await _context.Exams.FindAsync(id);

            if (exam == null)
            {
                return NotFound();
            }

            var questionsToRemove = _context.Questions.Where(q => q.IdExam == id);
            var answersToRemove = _context.Answers.Where(a => questionsToRemove.Any(q => q.Id == a.IdQuestion));
            var gradesToRemove = _context.Grades.Where(g => g.IdExam == id); 

            _context.Answers.RemoveRange(answersToRemove);
            _context.Questions.RemoveRange(questionsToRemove);
            _context.Grades.RemoveRange(gradesToRemove); 


            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExamExists(int id)
        {
            return _context.Exams.Any(e => e.Id == id);
        }

    }
}